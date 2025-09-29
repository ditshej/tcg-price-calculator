export function createAppAlpineData() {
    return {
        players: 21,
        boostersPerPlayerInPricepool: 3,
        minParticipantBoosterPrice: 1,
        displaySize: 24,
        boosterTotal: 0,
        displaysFull: 0,
        boostersInPartDisplay: 0,
        prices: {},
        boostersLeft: 0,
        rankAlreadyAssigned: 0,
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
            this.prices = {};
            this.boostersLeft = this.boosterTotal;
            this.assignMinParticipantBooster();
            if (this.winnerGetsDisplay) {
                this.assignDisplaysIfPossible();
            }
            this.assignNextRankTwoBoosters();
            this.distributeBoostersByCurve()
        },
        assignMinParticipantBooster() {
            for (let rank = 1; rank <= this.players; rank++) {
                this.prices[rank] = {rank: rank, boosters: this.minParticipantBoosterPrice};
                this.boostersLeft--;
            }
        },
        assignDisplaysIfPossible() {
            let displaysAssignable = Math.floor(this.boostersLeft / this.displaySize);
            for (let rank = 1; rank <= displaysAssignable; rank++) {
                let alreadyAssigned = this.prices[rank] ? this.prices[rank].boosters : 0;
                this.prices[rank] = {rank: rank, boosters: this.displaySize};
                this.boostersLeft -= (this.displaySize - alreadyAssigned);
                this.rankAlreadyAssigned = rank;
            }
        },
        assignNextRankTwoBoosters() {
            if (this.boostersLeft === 0) return;

            let boostersToAssign = 2;
            if (this.boostersLeft === 1) {
                boostersToAssign = 1;
            }
            let boostersAssigned = this.prices[this.rankAlreadyAssigned + 1] ? this.prices[this.rankAlreadyAssigned + 1].boosters : 0;
            this.prices[this.rankAlreadyAssigned + 1] = {
                rank: this.rankAlreadyAssigned + 1,
                boosters: boostersAssigned + boostersToAssign
            };
            this.boostersLeft -= boostersToAssign;
        },
        distributeBoostersByCurve() {
            if (this.boostersLeft === 0) return;

            // weights calculation
            const numRanks = this.players - this.rankAlreadyAssigned;
            const weights = [];
            let weightsSum = 0;
            for (let i = 0; i < numRanks; i++) {
                const weight = Math.pow(numRanks - i, this.distributionCurveExponent);
                weights[i] = weight;
                weightsSum += weight;
            }

            // Initial distribution
            let weightIndex = 0;
            for (let rank = this.rankAlreadyAssigned + 1; rank <= this.players; rank++) {
                let add = Math.floor(this.boostersLeft * weights[weightIndex] / weightsSum);
                let alreadyAssigned = this.prices[rank] ? this.prices[rank].boosters : 0;
                this.prices[rank] = {rank: rank + this.rankAlreadyAssigned, boosters: alreadyAssigned + add};
                this.boostersLeft -= add;
                weightIndex++;
            }

            // Distribute remaining boosters (due to rounding)
            if (this.boostersLeft === 0) return;

            let currentRank = this.rankAlreadyAssigned + 1;
            while (this.boostersLeft > 0) {
                if (currentRank > this.players) {
                    // restart from the first rank after already assigned
                    currentRank = this.rankAlreadyAssigned + 1;
                }
                let alreadyAssigned = this.prices[currentRank] ? this.prices[currentRank].boosters : 0;
                this.prices[currentRank] = {rank: currentRank, boosters: alreadyAssigned + 1};
                this.boostersLeft--;
                currentRank++;
            }
        }
    }
}