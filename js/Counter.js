"use strict"

//-------------------------------------------------------
// NAME		      : Johnny Lee
// STUDENT NUMBER : 7890682
// COURSE		  : COMP 2150
// INSTRUCTOR	  : Olivier Tremblay-Savard
// ASSIGNMENT	  : 4
// QUESTION	      : 1    
// 
// REMARKS: This program implements a game called 
// Potato Clicker. The game tracks the number of potatoes 
// collected and the rate of potato production (potatoes 
// per second) using a Counter class. Players can click a 
// button to collect potatoes, purchase shops to increase 
// production, and upgrade those shops for greater output. 
// The game includes achievements and bonus buttons for 
// temporary boosts
//-------------------------------------------------------
class Counter {
    
    // Instance Variables
    #htmlCounterId;
    #htmlPpsId;
    #htmlBonusMessageId;
    #htmlAchievementId;
    #rate;
    #multiplier;
    #bonusButtonList;
    #count;
    #totalCount;
    #currentAchievement;

    // Constants
    static get #DISPLAY_INTERVAL() {
        return 50;
    }

    static get #SECONDS_IN_MS() {
        return 1000;
    }

    static get #MIN_BONUS_SPAWN() {
        return 10;
    }

    static get #MAX_BONUS_SPAWN() {
        return 180;
    }

    static get #DISPLAY_BONUS() {
        return 10;
    }

    static get #DISPLAY_ACHIEVEMENT() {
        return 5;
    }

    static get #ACHIEVEMENT_FACTOR() {
        return 10;
    }

    // -------------------------------------------------------
    // Constructor
    //
    // PURPOSE: Constructor to create a Counter object
    // PARAMETERS:
    // - counterId: The html id of the counter element
	// - ppsId: The html if of the pps tracker element
    // - bonusMessageId: The html id for displaying bonus messages
	// - achievementMessageId: The html id for displaying achievement messages
    // -------------------------------------------------------
    constructor(counterId, ppsId, bonusMessageId, achievementMessageId) {
        this.#htmlCounterId = document.getElementById(counterId);
        this.#htmlPpsId = document.getElementById(ppsId);
        this.#htmlBonusMessageId = document.getElementById(bonusMessageId);
        this.#htmlAchievementId = document.getElementById(achievementMessageId);
        this.#count = 0;
        this.#totalCount = 0;
        this.#rate = 1;
        this.#multiplier = 1;
        this.#currentAchievement = Counter.#ACHIEVEMENT_FACTOR;
        this.#bonusButtonList = [];
        this.#startCounter();
    }

    // -------------------------------------------------------
    // multiplier
    //
    // PURPOSE: Return the current multipler
    // -------------------------------------------------------
    get multiplier() {
        return this.#multiplier;
    }

    // -------------------------------------------------------
    // count
    //
    // PURPOSE: Return the current count
    // -------------------------------------------------------
    get count() {
        return this.#count;
    }

    // -------------------------------------------------------
    // cheat
    //
    // PURPOSE: Add many potatoes to your count
    // -------------------------------------------------------
    cheat() {
        this.#count = 10000000000;
    }

    // -------------------------------------------------------
	// addIdlePotatoes
	//
	// PURPOSE: Adds potatoes collected during idle time (50ms) 
	// to the current and total counts
	// -------------------------------------------------------
    #addIdlePotatoes() {
        let delta = (this.#rate * this.#multiplier) * (Counter.#DISPLAY_INTERVAL/Counter.#SECONDS_IN_MS);
        this.#count += delta;
        this.#totalCount += delta;
    }

    // -------------------------------------------------------
	// updateCounter
	//
	// PURPOSE: Updates the potato count and potatoes-per-second 
	// (pps) display every 50 milliseconds. Also checks if the 
	// player has reached a new achievement milestone
	// -------------------------------------------------------
    #updateCounter() {
        this.#addIdlePotatoes();
        this.#checkAchievement();
        this.#htmlCounterId.innerHTML = `Potatos In Sac: <br> ${Math.round(this.#count)}`;
        this.#htmlPpsId.innerHTML = `Potatoes Per Second (pps): <br> ${this.#rate * this.#multiplier}`;
    }

    // -------------------------------------------------------
	// startCounter
	//
	// PURPOSE: Sets intervals to update the counter/pps and 
	// display a random bonus button at random intervals
	// -------------------------------------------------------
    #startCounter() {
        setInterval(this.#updateCounter.bind(this), Counter.#DISPLAY_INTERVAL);
        this.#scheduleBonus();
    }

    // -------------------------------------------------------
    // addToCount
    //
    // PURPOSE: Adds the given amount (factored by multiplier) to
    // both current and total potato counts when clicked
    // -------------------------------------------------------
    addToCount(amount) {
        let delta = (amount * this.#multiplier);
        this.#count += delta;
        this.#totalCount += delta;
    }

    // -------------------------------------------------------
	// buy
	//
	// PURPOSE: Purchases a shop or upgrade, decreasing the current 
	// count and increasing the pps rate
	// PARAMETERS:
	// - cost: The cost of the item
	// - rateGain: The pps increase from the purchase
	// -------------------------------------------------------
    buy(cost, rateGain) {
        this.#count -= cost;
        this.#rate += rateGain;
    }

    // -------------------------------------------------------
    // checkAchievement
    //
    // PURPOSE: Checks if the player has reached the next 
    // achievement threshold. If so, shows a message and updates 
    // the next threshold.
    // -------------------------------------------------------
    #checkAchievement() {
        if (this.#totalCount >= this.#currentAchievement) {
            this.#showAchievementMessage();
            this.#currentAchievement *= Counter.#ACHIEVEMENT_FACTOR;
        }
    }

    // -------------------------------------------------------
    // showAchievementMessage
    //
    // PURPOSE: Displays the achievement message when a new 
    // milestone is reached, then hides it after #DISPLAY_ACHIEVEMENT
    // seconds
    // -------------------------------------------------------
    #showAchievementMessage() {
        this.#htmlAchievementId.innerHTML = (
            `Congratulations! <br> You made a total of: <br> ${this.#currentAchievement} potatoes!`
        );
        this.#htmlAchievementId.classList.remove("hidden");
        setTimeout(()=> {
            this.#htmlAchievementId.classList.add("hidden")
        }, Counter.#DISPLAY_ACHIEVEMENT * Counter.#SECONDS_IN_MS);
    }

    // -------------------------------------------------------
	// addBonusButton
	//
	// PURPOSE: Adds a bonus button to the list of bonus buttons
	// PARAMETERS:
	// - bonusButton: The bonus button to add
	// -------------------------------------------------------
    addBonusButton(bb) {
        this.#bonusButtonList.push(bb);
    }

    // -------------------------------------------------------
    // scheduleBonus
    //
    // PURPOSE: Schedules the display of the bonus button after 
    // a random delay.
    // -------------------------------------------------------
    #scheduleBonus() {
        let range = Counter.#MAX_BONUS_SPAWN - Counter.#MIN_BONUS_SPAWN + 1;
        let delaySeconds = Math.floor(Math.random() * (range) + Counter.#MIN_BONUS_SPAWN);
        let delay = (delaySeconds - Counter.#DISPLAY_BONUS) * Counter.#SECONDS_IN_MS;
        setTimeout(()=> {
            this.#displayBonusButton()
        }, delay);
    }

    // -------------------------------------------------------
    // displayBonusButton
    //
    // PURPOSE: Displays a random bonus button, hides it after 
    // #DISPLAY_BONUS seconds, and reschedules the display of a 
    // new bonus button.
    // -------------------------------------------------------
    #displayBonusButton() {
        let idx = Math.floor(Math.random() * this.#bonusButtonList.length);
        this.#bonusButtonList[idx].htmlButton.classList.remove("hidden");

        setTimeout(()=> {
            this.#bonusButtonList[idx].htmlButton.classList.add("hidden");
            this.#scheduleBonus()
        }, Counter.#DISPLAY_BONUS * Counter.#SECONDS_IN_MS);
    }

    // -------------------------------------------------------
    // showBonusMessage
    //
    // PURPOSE: Displays a temporary bonus message for a set 
    // amount of time before hiding it again
    // PARAMETERS:
    // - message: The message to display
    // - displaySeconds: How long the message should be shown in seconds
    // -------------------------------------------------------
    showBonusMessage(message, displaySeconds) {
        this.#htmlBonusMessageId.innerHTML = message;
        this.#htmlBonusMessageId.classList.remove("hidden");
        setTimeout(()=> {
            this.#htmlBonusMessageId.classList.add("hidden")
        }, displaySeconds * Counter.#SECONDS_IN_MS);
    }

    // -------------------------------------------------------
	// scaleRateBonus
	//
	// PURPOSE: Increases the multiplier for a bonus for a given 
	// duration, then resets it after the duration ends
	// PARAMETERS:
	// - factor: The multiplier increase factor
	// - duration: The time (in seconds) the bonus multiplier lasts
	// -------------------------------------------------------
    scaleBonusRate(factor, duration) {
        this.#multiplier*=factor;

        setTimeout(()=> {
            this.#multiplier /= factor;
        }, duration * Counter.#SECONDS_IN_MS);
    }
}