"use strict"

// -------------------------------------------------------
// CLASS: Button
//
// AUTHOR: Johnny Lee, 7890682
//
// REMARKS: An abstract base class for creating buttons, which 
// includes the button's HTML id, a reference to the counter instance, 
// and the button's name. Subclasses must implement the click()
// method, which defines the action performed when the button is clicked.
// -------------------------------------------------------
class Button {

    // Instance Variables
    #htmlButtonId;
    #htmlTextId;
    #counter;
    #name;
    
    // Constant
    static get #TEXT_TAG() {
        return "-text";
    }

    // -------------------------------------------------------
    // Constructor
    //
    // PURPOSE: Constructor to create a Button object
    // PARAMETERS:
    // - name: The html id of the button element
	// - counter: The counter object for the click potato game
	// messages
    // -------------------------------------------------------
    constructor(name, counter) {
        if (this.constructor.name == "Button") {
            throw new Error(this.constructor.name + " is an abstract class and cannot be instantiated.");
        }
        this.#name = name;
        this.#counter = counter;
        this.#htmlButtonId = document.getElementById(name);
        this.#htmlTextId = document.getElementById(name + Button.#TEXT_TAG);
        this.#htmlButtonId.addEventListener("click", this.click.bind(this));
    }

    // Getters
    get counter() {
        return this.#counter;
    }

    get name() {
        return this.#name;
    }

    get htmlButton() {
        return this.#htmlButtonId;
    }

    // -------------------------------------------------------
    // updateText
    //
	// PURPOSE: Updates the information displayed for the button
    // -------------------------------------------------------
    updateText(newText) {
        this.#htmlTextId.innerHTML = newText;
    }

    // -------------------------------------------------------
    // click
    //
	// PURPOSE: Abstract method that defines the action to be 
	// performed when the button is clicked. Must be implemented 
	// by subclasses.
    // -------------------------------------------------------
    click() {
        throw new Error("click() must be implemented!");
    }
}

// -------------------------------------------------------
// CLASS: ClickingPotato
//
// AUTHOR: Johnny Lee, 7890682
//
// REMARKS: Represents the big potato button that increments
// the potato count by the current Potatoes Per Click (PPC) 
// when clicked. Implements the click() method to define 
// the specific behavior when clicked.
// -------------------------------------------------------
class ClickingPotato extends Button {

    // Instance Variables
    #potatoesPerClick;
    #htmlFloatId;

    // -------------------------------------------------------
    // Constructor
    //
    // PURPOSE: Constructor to create a ClickingButton object
    // PARAMETERS:
    // - name: The html id of the button element
	// - counter: The counter object for the click potato game
    // - htmlFloatId: The html id of the floating text element
	// messages
    // -------------------------------------------------------
    constructor(name, counter, htmlFloatId) {
        super(name, counter);
        this.#potatoesPerClick = 1;
        this.#htmlFloatId = document.getElementById(htmlFloatId);
    }

    // -------------------------------------------------------
	// click
	//
	// PURPOSE: Increments the potato count by PPC and displays 
	// a "+PPC" message when the big potato button is clicked.
	// -------------------------------------------------------
    click() {
        this.counter.addToCount(this.#potatoesPerClick);
        this.#showFloatText();
    }

    // -------------------------------------------------------
    // showFloatText
    //
    // PURPOSE: Displays the amount of potatoes added floating 
    // upwards after the big potato is clicked.
    // -------------------------------------------------------
    #showFloatText() {
        this.#htmlFloatId.textContent = `+${this.#potatoesPerClick * this.counter.multiplier}`;
        this.#htmlFloatId.style.animation = 'none';
        void this.#htmlFloatId.offsetWidth;
        this.#htmlFloatId.style.animation = `floatUp 0.3s ease-out`;
    }

    // -------------------------------------------------------
	// incrementPPC
	//
	// PURPOSE: Increments the PPC
	// -------------------------------------------------------
    incrementPPC() {
        this.#potatoesPerClick++;
    }
}

// -------------------------------------------------------
// CLASS: PurchasableButton
//
// AUTHOR: Johnny Lee, 7890682
//
// REMARKS: Abstract base class for buttons that represent
// purchasable items (Buildings, Upgrades). Handles pricing,
// scaling, and purchase logic. Subclasses must implement 
// rateAddition() to define how much the purchase increases pps.
// -------------------------------------------------------
class PurchasableButton extends Button{

    // Instances Variables
    #price;
    #priceScaleFactor;
    #numPurchases;

    // -------------------------------------------------------
    // Constructor
    //
    // PURPOSE: Constructor to create a PurchasableButton object
    // PARAMETERS:
    // - name: The html id of the button element
	// - counter: The counter object for the click potato game
	// - price: The initial cost of the item
	// - priceScaleFactor: Multiplier to increase the price after each purchase
    // -------------------------------------------------------
    constructor(name, counter, price, priceScaleFactor) {
        super(name, counter);
        if (this.constructor.name == "PurchasableButton") {
            throw new Error(this.constructor.name + " is an abstract class and cannot be instantiated.");
        }
        this.#price = price;
        this.#priceScaleFactor = priceScaleFactor;
        this.#numPurchases = 0;
    }

	// -------------------------------------------------------
    // numPurchases
    //
    // PURPOSE: Return the number of times the item has been purchased
    // -------------------------------------------------------
	get numPurchases() {
		return this.#numPurchases;
	}

	// -------------------------------------------------------
    // price
    //
    // PURPOSE: Return the current price of the item
    // -------------------------------------------------------
	get price() {
		return this.#price;
	}

    // -------------------------------------------------------
	// purchase
	//
	// PURPOSE: Attempts to buy the item if the user has enough
	// potatoes. On success, increases rate, updates price,
	// and tracks number of purchases.
	// RETURNS: 
	// - true if purchase was successful, false otherwise
	// -------------------------------------------------------
    purchase() {
        let purchased = false;
        if (this.counter.count >= this.#price) {
            this.counter.buy(this.#price, this.rateAddition());
            this.#price *= this.#priceScaleFactor;
            this.#numPurchases++;
            purchased = true;
        }

        return purchased;
    }

    // -------------------------------------------------------
	// rateAddition
	//
	// PURPOSE: Abstract method that defines how much a purchase 
	// increases the PPS (potatoes per second). Must be implemented 
	// by subclasses.
	// -------------------------------------------------------
    rateAddition() {
        throw new Error(this.constructor.name + " must implement rateAddition().");
    }

    // -------------------------------------------------------
	// refreshInfo
	//
	// PURPOSE: Returns updated button text showing the number 
	// of purchases and the current rounded cost.
	// -------------------------------------------------------
    refreshInfo() {
        return `${this.name}: ${this.numPurchases}<br>Cost: ${Math.round(this.price)}`;
    }
}

// -------------------------------------------------------
// CLASS: BuildingButton
//
// AUTHOR: Johnny Lee, 7890682
//
// REMARKS: Represents a building button that, when bought,
// increases the pps. It implements both click() for 
// handling purchases and rateAddition() to define the pps
// increase per purchase.
// -------------------------------------------------------
class BuildingButton extends PurchasableButton {

    // Instance Variable
    #rate;

    // Constant
    static get #PRICE_SCALE_FACTOR() {
        return 1.5;
    }

    // -------------------------------------------------------
    // Constructor
    //
    // PURPOSE: Constructor to create a BuildingButton object
    // PARAMETERS:
    // - name: The html id of the button element
	// - counter: The counter object for the click potato game
	// - price: The initial cost of the item
	// - rate: The pps increase after each purchase
    // -------------------------------------------------------
    constructor(name, counter, price, rate) {
        super(name, counter, price, BuildingButton.#PRICE_SCALE_FACTOR);
        this.#rate = rate;
    }

    // -------------------------------------------------------
	// rate
	//
	// PURPOSE: Returns the pps addition from the building
	// -------------------------------------------------------
    get rate() {
        return this.#rate;
    }

    // -------------------------------------------------------
	// scaleRate
	//
	// PURPOSE: Scales the pps addition from the building by 
	// the given factor
	// -------------------------------------------------------
    scaleRate(factor) {
        this.#rate *= factor;
    }

    // -------------------------------------------------------
	// rateAddition
	//
	// PURPOSE: Returns the pps addition from the building
	// -------------------------------------------------------
    rateAddition() {
        return this.rate;
    }

    // -------------------------------------------------------
	// click
	//
	// PURPOSE: Attempts to purchase the building and refreshes
	// its information if so
	// -------------------------------------------------------
    click() {
        if (this.purchase()) {
            this.refreshInfo();
        }
    }

	// -------------------------------------------------------
	// refreshInfo
	//
	// PURPOSE: Updates the information displayed for the building
	// -------------------------------------------------------
    refreshInfo() {
        this.updateText(super.refreshInfo() + `<br>Adds: ${this.#rate} pps`);
       
    }
}

// -------------------------------------------------------
// CLASS: UpgradeButton
//
// AUTHOR: Johnny Lee, 7890682
//
// REMARKS: Represents a upgrade button that, when bought,
// increases the pps of its corresponding building. It implements 
// both click() for  handling purchases and rateAddition() to 
// define the pps increase per purchase.
// -------------------------------------------------------
class UpgradeButton extends PurchasableButton {

    // Instance Variables
    #rateScale
    #building;

    // Constant
    static get #PRICE_SCALE_FACTOR() {
        return 5;
    }

    // -------------------------------------------------------
    // Constructor
    //
    // PURPOSE: Constructor to create a UpgradeButton object
    // PARAMETERS:
    // - name: The html id of the button element
	// - counter: The counter object for the click potato game
	// - price: The initial cost of the item
	// - rateScale: The pps increase after each purchase
	// - building: The building to upgrade
    // -------------------------------------------------------
    constructor(name, counter, price, rateScale, building) {
        super(name, counter, price, UpgradeButton.#PRICE_SCALE_FACTOR);
        this.#rateScale = rateScale;
        this.#building = building;
    }

    // -------------------------------------------------------
	// rateAddition
	//
	// PURPOSE: Returns the pps addition from the upgrade
	// -------------------------------------------------------
    rateAddition() {
        return (this.#building.rate * this.#building.numPurchases) * (this.#rateScale - 1);
    }

    // -------------------------------------------------------
	// refreshInfo
	//
	// PURPOSE: Updates the information displayed for the upgrade
	// -------------------------------------------------------
    refreshInfo() {
        this.updateText(
            super.refreshInfo() + 
            `<br>${this.#building.name} Prod. x${this.#rateScale}`
        );
    }

    // -------------------------------------------------------
	// click
	//
	// PURPOSE: Attempts to purchase the upgrade, scales the 
	// building's rates, and refreshes both the building's and 
	// the upgrade's information
	// -------------------------------------------------------
    click() {
        if (this.purchase()) {
            this.#building.scaleRate(this.#rateScale);
            this.refreshInfo();
            this.#building.refreshInfo();
        }
    }
}

// -------------------------------------------------------
// CLASS: FastHands
//
// AUTHOR: Johnny Lee, 7890682
//
// REMARKS: Represents a purchasable upgrade that increases 
// the PPC for the ClickingPotato button. When purchased, it 
// increments the PPC by 1. It implements  the click() and
// rateAddition() methods
// -------------------------------------------------------
class FastHands extends PurchasableButton{

    // Instance Variable
    #clickPotato;


    // Constants
    static get #PRICE_SCALE_FACTOR() {
        return 1.2;
    }

    static get #RATE() {
        return 0;
    }

    // -------------------------------------------------------
    // Constructor
    //
    // PURPOSE: Constructor to create a FastHands object
    // PARAMETERS:
    // - name: The html id of the button element
	// - counter: The counter object for the click potato game
	// - price: The initial cost of the item
	// - clickPotato: The click potato object
    // -------------------------------------------------------
    constructor(name, counter, price, clickPotato) {
        super(name, counter, price, FastHands.#PRICE_SCALE_FACTOR);
        this.#clickPotato = clickPotato;
    }

    // -------------------------------------------------------
	// rateAddition
	//
	// PURPOSE: Returns the pps addition from the upgrade (0)
	// -------------------------------------------------------
    rateAddition() {
        return FastHands.#RATE;
    }

    // -------------------------------------------------------
    // click
    //
    // PURPOSE: Attempts to purchase the upgrade, increments the PPC, 
    // and refreshes the information for both the big potato button 
    // and the FastHands upgrade.
    // -------------------------------------------------------
    click() {
        if (this.purchase()) {
            this.#clickPotato.incrementPPC();
            this.refreshInfo();
        }
    }

    // -------------------------------------------------------
	// refreshInfo
	//
	// PURPOSE: Updates the information displayed for the fast hands
	// -------------------------------------------------------
    refreshInfo() {
        this.updateText(super.refreshInfo() + `<br>+1 Per Click`);
    }

}

// -------------------------------------------------------
// CLASS: BonusButton
//
// AUTHOR: Johnny Lee, 7890682
//
// REMARKS: Represents a bonus button that, when clicked, 
// applies a multiplier to the pps for a specified duration
// -------------------------------------------------------
class BonusButton extends Button {

    // Instance Variables
    #multiplier;
    #duration;

    // Constant
    static get #DISPLAY_BONUS_MESSAGE() {
        return 5;
    }

    // -------------------------------------------------------
    // Constructor
    //
    // PURPOSE: Constructor to create a BonusButton object
    // PARAMETERS:
    // - name: The html id of the button element
	// - counter: The counter object for the click potato game
	// - multiplier: The multiplier applied to the pps
	// - duration: The length of the bonus in seconds
    // -------------------------------------------------------
    constructor(name, counter, multiplier, duration) {
        super(name, counter);

        this.#multiplier = multiplier;
        this.#duration = duration;
    }

    // -------------------------------------------------------
	// clickAction
	//
	// PURPOSE: Applies the bonus by multiplying the pps for the
	// duration of the bonus, hides the button, and displays a
	// message indicating the bonus has started
	// -------------------------------------------------------
    click() {
        this.counter.scaleBonusRate(this.#multiplier, this.#duration);
        this.htmlButton.classList.add("hidden");
        let bonusMessage = (
            `${this.name} Bonus started!<br>` +
            `${this.#multiplier}x pps for ${this.#duration} seconds!`
        );
        this.counter.showBonusMessage(bonusMessage, BonusButton.#DISPLAY_BONUS_MESSAGE);
    }
}