export function createAppAlpineData() {
    return {
        players: 21,
        boostersPerPlayerInPricepool: 3,
        displaySize: 24,
        boosterTotal: 0,
        displaysFull: 0,
        boostersInPartDisplay: 0,
        prices: [],
        distributionCurveExponent: 1,
        distributionCurveOptions: [
            {value: 0.5, label: "Flat"},
            {value: 1, label: "Balanced"},
            {value: 2, label: "Standard"},
            {value: 5, label: "Steep"},
            {value: 10, label: "Very Steep"},
            {value: 20, label: "Extreme"}
        ],
        winnerGetsDisplay: false,
        editingExponent: false,
        tempExponent: '',
        undistributedBoosters: 0,
        addPlayer() {
            this.players++;
            this.calculate()
        },
        removePlayer() {
            if (this.players > 1) {
                this.players--;
            }
            this.calculate()
        },
        addBoostersPerPlayerInPricepool() {
            this.boostersPerPlayerInPricepool++;
            this.calculate()
        },
        addDisplaySize() {
            this.displaySize++;
            this.calculate();
        },
        removeDisplaySize() {
            if (this.displaySize > 1) {
                this.displaySize--;
                this.calculate();
            }
        },
        removeBoostersPerPlayerInPricepool() {
            if (this.boostersPerPlayerInPricepool > 1) {
                this.boostersPerPlayerInPricepool--;
            }
            this.calculate()
        },
        setDistributionCurveExponent(value) {
            this.distributionCurveExponent = value;
            this.winnerGetsDisplay = this.winnerGetsDisplay && this.canWinnerGetDisplay();
            this.calculate();
        },
        canWinnerGetDisplay() {
            return this.boosterTotal >= this.displaySize;
        },
        toggleWinnerGetsDisplay() {
            if (this.canWinnerGetDisplay()) {
                this.winnerGetsDisplay = !this.winnerGetsDisplay;
                this.calculate();
            }
        },
        startEditingExponent() {
            this.tempExponent = this.distributionCurveExponent;
            this.editingExponent = true;
        },
        finishEditingExponent() {
            const val = parseFloat(this.tempExponent);
            if (!isNaN(val) && val > 0) {
                this.distributionCurveExponent = val;
                this.calculate();
            }
            this.editingExponent = false;
        },
        calculate() {
            this.boosterTotal = this.players * this.boostersPerPlayerInPricepool;
            this.displaysFull = Math.floor(this.boosterTotal / this.displaySize);
            this.boostersInPartDisplay = this.boosterTotal % this.displaySize;
            if (!this.canWinnerGetDisplay()) {
                this.winnerGetsDisplay = false;
            }
            this.calculatePricepool();
        },
        calculatePricepool() {
            let prices = [];
            let boostersLeft = this.boosterTotal;
            let playerCount = this.players;
            if (this.winnerGetsDisplay && boostersLeft >= this.displaySize && playerCount > 1) {
                // Winner gets a full display
                prices.push({rank: 1, boosters: this.displaySize});
                boostersLeft -= this.displaySize;
                let ranksAssigned = 1;
                let remainingPlayers = playerCount - 1;
                // Iteratively assign max displays to next places if curve would give more than max
                while (remainingPlayers > 0 && boostersLeft > 0) {
                    // Calculate curve for remaining players and boosters
                    let curve = this.distributionCurve(remainingPlayers, boostersLeft, this.distributionCurveExponent, this.displaySize);
                    // Check if the first in curve would get max
                    if (curve.length > 0 && curve[0].boosters === this.displaySize) {
                        // Assign a full display to this rank
                        prices.push({rank: ranksAssigned + 1, boosters: this.displaySize});
                        boostersLeft -= this.displaySize;
                        ranksAssigned++;
                        remainingPlayers--;
                    } else {
                        // Assign the rest as per curve
                        for (let i = 0; i < curve.length; i++) {
                            prices.push({rank: ranksAssigned + 1 + i, boosters: curve[i].boosters});
                        }
                        boostersLeft = 0; // All boosters distributed in this step
                        break;
                    }
                }
            } else {
                // Normal distribution
                prices = this.distributionCurve(playerCount, boostersLeft, this.distributionCurveExponent);
                boostersLeft = 0;
            }
            this.prices = prices;
            // Calculate undistributed boosters
            const distributed = this.prices.reduce((sum, p) => sum + p.boosters, 0);
            this.undistributedBoosters = Math.max(0, this.boosterTotal - distributed);
        },
        distributionCurve(playersCount, boosterCount, exponent, maxPerPlayer = null) {
            if (playersCount <= 0 || boosterCount <= 0) return [];
            // Everyone gets at least 1 booster
            let base = Math.min(boosterCount, playersCount);
            let boostersToDistribute = boosterCount - base;
            // Calculate weights
            const weights = [];
            let weightsSum = 0;
            for (let i = 1; i <= playersCount; i++) {
                const weight = Math.pow(playersCount - i + 1, exponent);
                weights.push(weight);
                weightsSum += weight;
            }
            // Initial distribution
            const distribution = [];
            let distributed = 0;
            for (let i = 0; i < playersCount; i++) {
                let add = boostersToDistribute > 0 ? Math.floor(boostersToDistribute * weights[i] / weightsSum) : 0;
                let total = 1 + add;
                if (maxPerPlayer !== null) total = Math.min(total, maxPerPlayer);
                distribution.push({rank: i + 1, boosters: total});
                distributed += total;
            }
            // Distribute remaining boosters (due to rounding)
            let left = boosterCount - distributed;
            let idx = 0;
            while (left > 0) {
                if (maxPerPlayer === null || distribution[idx].boosters < maxPerPlayer) {
                    distribution[idx].boosters++;
                    left--;
                }
                idx++;
                if (idx >= playersCount) idx = 0;
                // If no one can take more, break (to avoid infinite loop)
                if (maxPerPlayer !== null && !distribution.some(p => p.boosters < maxPerPlayer)) break;
            }
            return distribution;
        },
    }
}