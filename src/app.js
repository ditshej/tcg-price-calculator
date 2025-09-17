export function createAppAlpineData() {
    return {
        players: 21,
        boostersPerPlayerInPricepool: 3,
        boosterTotal: 0,
        displaysFull: 0,
        boostersInPartDisplay: 0,
        prices: [],
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
        calculate() {
            this.boosterTotal = this.players * this.boostersPerPlayerInPricepool;
            this.displaysFull = Math.floor(this.boosterTotal / 24);
            this.boostersInPartDisplay = this.boosterTotal % 24;

            this.prices = this.calculatePrices()
        },
        calculatePrices() {
            const playersCount = this.players;
            const boosterTotal = this.boosterTotal

            // everyone gets at least 1 booster
            const boosterMin = playersCount;
            const boostersToFillUp = boosterTotal - boosterMin;

            if (boostersToFillUp < 0) {
                return [];
            }

            // calculate weights for flat curve
            const weights = [];
            let weightsSum = 0;

            for (let i = 1; i <= playersCount; i++) {
                const weight = Math.pow(playersCount - i + 1, 0.7);
                weights.push(weight);
                weightsSum += weight;
            }

            // calculate the first round of distribution
            const distribution = [];
            let distributedBoosters = 0;

            for (let i = 0; i < playersCount; i++) {
                const additionalBoosters = Math.floor(boostersToFillUp * weights[i] / weightsSum);
                const boosters = 1 + additionalBoosters;
                distribution.push({ rank: i + 1, boosters: boosters });
                distributedBoosters += boosters;
            }

            // distribute remaining boosters (due to rounding)
            let remainingBoosters = boosterTotal - distributedBoosters;
            // give the first player two boosters more than the second player if there are remaining boosters
            let difference = distribution[0].boosters - distribution[1].boosters;
            let giveExtraToFirst = difference < 2 ? 2 - difference : 0;
            if (remainingBoosters > giveExtraToFirst) {
                distribution[0].boosters += giveExtraToFirst;
                remainingBoosters -= giveExtraToFirst;
            }
            let index = 0;
            while (remainingBoosters > 0 && index < playersCount) {
                distribution[index].boosters++;
                remainingBoosters--;
                index++;
            }

            return distribution;
        }
    };
}