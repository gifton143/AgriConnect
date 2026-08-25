// ===============================
// AgriConnect - script.js
// ===============================

// ---------- DATA ----------

let crops = JSON.parse(localStorage.getItem("agriCrops")) || [
    {
        id: 1,
        name: "Tomato",
        quantity: 100,
        price: 28,
        location: "Chennai",
        farmer: "Demo Farmer"
    },
    {
        id: 2,
        name: "Rice",
        quantity: 250,
        price: 42,
        location: "Thanjavur",
        farmer: "Demo Farmer"
    },
    {
        id: 3,
        name: "Onion",
        quantity: 150,
        price: 32,
        location: "Coimbatore",
        farmer: "Demo Farmer"
    }
];


let machines = JSON.parse(localStorage.getItem("agriMachines")) || [
    {
        id: 1,
        name: "John Deere Tractor",
        type: "Tractor",
        rent: 2500,
        location: "Chennai",
        owner: "Machinery Owner"
    },
    {
        id: 2,
        name: "Power Tiller",
        type: "Power Tiller",
        rent: 1500,
        location: "Coimbatore",
        owner: "Machinery Owner"
    },
    {
        id: 3,
        name: "Crop Harvester",
        type: "Harvester",
        rent: 4000,
        location: "Thanjavur",
        owner: "Machinery Owner"
    }
];


let fertilizers = [
    {
        id: 101,
        name: "Organic Compost",
        description: "Natural compost for healthy soil",
        price: 450,
        quantity: "25 kg"
    },
    {
        id: 102,
        name: "Neem Cake",
        description: "Organic neem fertilizer",
        price: 600,
        quantity: "25 kg"
    },
    {
        id: 103,
        name: "Vermicompost",
        description: "Rich organic fertilizer",
        price: 500,
        quantity: "25 kg"
    },
    {
        id: 104,
        name: "Panchagavya",
        description: "Natural liquid organic fertilizer",
        price: 300,
        quantity: "5 litre"
    }
];


let cart = JSON.parse(localStorage.getItem("agriCart")) || [];

let orders = JSON.parse(localStorage.getItem("agriOrders")) || [];


// ---------- SAVE DATA ----------

function saveData() {

    localStorage.setItem(
        "agriCrops",
        JSON.stringify(crops)
    );

    localStorage.setItem(
        "agriMachines",
        JSON.stringify(machines)
    );

    localStorage.setItem(
        "agriCart",
        JSON.stringify(cart)
    );

    localStorage.setItem(
        "agriOrders",
        JSON.stringify(orders)
    );
}


// ---------- PAGE NAVIGATION ----------

function showSection(sectionName) {

    const sections = document.querySelectorAll(".section");

    sections.forEach(function(section) {
        section.classList.remove("active");
    });


    const selectedSection =
        document.getElementById(sectionName);


    if (selectedSection) {
        selectedSection.classList.add("active");
    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    if (sectionName === "farmer") {
        displayFarmerCrops();
    }

    if (sectionName === "buyer") {
        displayCrops();
    }

    if (sectionName === "machinery") {
        displayMachines();
    }

    if (sectionName === "fertilizer") {
        displayFertilizers();
    }

    if (sectionName === "orders") {
        displayCart();
        displayOrders();
    }
}


// ---------- LOGIN ----------

function openLogin() {

    const modal =
        document.getElementById("loginModal");

    if (modal) {
        modal.classList.add("show");
    }
}


function closeLogin() {

    const modal =
        document.getElementById("loginModal");

    if (modal) {
        modal.classList.remove("show");
    }
}


function loginUser() {

    const name =
        document.getElementById("userName").value.trim();

    const role =
        document.getElementById("userRole").value;


    if (name === "") {
        alert("Please enter your name.");
        return;
    }


    localStorage.setItem(
        "agriUser",
        JSON.stringify({
            name: name,
            role: role
        })
    );


    alert(
        "Welcome " +
        name +
        "!\nRole: " +
        role
    );


    closeLogin();
}


// ---------- FARMER CROP FORM ----------

function openCropForm() {

    document
        .getElementById("cropModal")
        .classList.add("show");
}


function closeCropForm() {

    document
        .getElementById("cropModal")
        .classList.remove("show");
}


function addCrop() {

    const name =
        document.getElementById("cropName").value.trim();

    const quantity =
        Number(
            document.getElementById("cropQuantity").value
        );

    const price =
        Number(
            document.getElementById("cropPrice").value
        );

    const location =
        document.getElementById("cropLocation").value.trim();


    if (
        name === "" ||
        quantity <= 0 ||
        price <= 0 ||
        location === ""
    ) {

        alert(
            "Please enter all crop details correctly."
        );

        return;
    }


    const user =
        JSON.parse(
            localStorage.getItem("agriUser")
        );


    const farmerName =
        user ? user.name : "Farmer";


    const newCrop = {

        id: Date.now(),

        name: name,

        quantity: quantity,

        price: price,

        location: location,

        farmer: farmerName
    };


    crops.push(newCrop);

    saveData();

    displayFarmerCrops();

    displayCrops();


    document.getElementById("cropName").value = "";

    document.getElementById("cropQuantity").value = "";

    document.getElementById("cropPrice").value = "";

    document.getElementById("cropLocation").value = "";


    closeCropForm();


    alert(
        name +
        " successfully added to marketplace!"
    );
}


// ---------- FARMER CROP DISPLAY ----------

function displayFarmerCrops() {

    const container =
        document.getElementById("farmerCropList");


    if (!container) return;


    if (crops.length === 0) {

        container.innerHTML =
            "<p>No crop listings available.</p>";

        return;
    }


    container.innerHTML = "";


    crops.forEach(function(crop) {

        const card =
            document.createElement("div");

        card.className = "card";


        card.innerHTML = `

            <h3>🌾 ${crop.name}</h3>

            <p>
                👨‍🌾 Farmer:
                ${crop.farmer}
            </p>

            <p>
                📦 Quantity:
                ${crop.quantity} kg
            </p>

            <p>
                📍 Location:
                ${crop.location}
            </p>

            <div class="price">
                ₹${crop.price} / kg
            </div>

            <button
                onclick="deleteCrop(${crop.id})"
            >
                Delete Listing
            </button>
        `;


        container.appendChild(card);

    });
}


// ---------- DELETE CROP ----------

function deleteCrop(id) {

    const confirmDelete =
        confirm(
            "Delete this crop listing?"
        );


    if (!confirmDelete) return;


    crops =
        crops.filter(function(crop) {

            return crop.id !== id;

        });


    saveData();

    displayFarmerCrops();

    displayCrops();
}


// ---------- BUYER CROP DISPLAY ----------

function displayCrops() {

    const container =
        document.getElementById("buyerCropList");


    if (!container) return;


    const searchInput =
        document.getElementById("cropSearch");


    const search =
        searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";


    const filteredCrops =
        crops.filter(function(crop) {

            return crop.name
                .toLowerCase()
                .includes(search);

        });


    container.innerHTML = "";


    if (filteredCrops.length === 0) {

        container.innerHTML =
            "<p>No crops found.</p>";

        return;
    }


    filteredCrops.forEach(function(crop) {

        const card =
            document.createElement("div");

        card.className = "card";


        card.innerHTML = `

            <h3>🌾 ${crop.name}</h3>

            <p>
                👨‍🌾 Farmer:
                ${crop.farmer}
            </p>

            <p>
                📦 Available:
                ${crop.quantity} kg
            </p>

            <p>
                📍 ${crop.location}
            </p>

            <div class="price">
                ₹${crop.price} / kg
            </div>

            <button
                onclick="addCropToCart(${crop.id})"
            >
                🛒 Buy Crop
            </button>
        `;


        container.appendChild(card);

    });
}


// ---------- ADD CROP TO CART ----------

function addCropToCart(id) {

    const crop =
        crops.find(function(item) {

            return item.id === id;

        });


    if (!crop) return;


    cart.push({

        id: Date.now(),

        productId: crop.id,

        type: "crop",

        name: crop.name,

        price: crop.price,

        quantity: 1,

        seller: crop.farmer
    });


    saveData();

    updateCartCount();


    alert(
        crop.name +
        " added to cart!"
    );
}


// ---------- MACHINERY FORM ----------

function openMachineForm() {

    document
        .getElementById("machineModal")
        .classList.add("show");
}


function closeMachineForm() {

    document
        .getElementById("machineModal")
        .classList.remove("show");
}


function addMachine() {

    const name =
        document
            .getElementById("machineName")
            .value
            .trim();


    const type =
        document.getElementById("machineType").value;


    const rent =
        Number(
            document.getElementById("machineRent").value
        );


    const location =
        document
            .getElementById("machineLocation")
            .value
            .trim();


    if (
        name === "" ||
        rent <= 0 ||
        location === ""
    ) {

        alert(
            "Please enter all machinery details."
        );

        return;
    }


    const user =
        JSON.parse(
            localStorage.getItem("agriUser")
        );


    const owner =
        user ? user.name : "Machinery Owner";


    machines.push({

        id: Date.now(),

        name: name,

        type: type,

        rent: rent,

        location: location,

        owner: owner

    });


    saveData();

    displayMachines();


    document.getElementById("machineName").value = "";

    document.getElementById("machineRent").value = "";

    document.getElementById("machineLocation").value = "";


    closeMachineForm();


    alert(
        "Machinery successfully added!"
    );
}


// ---------- MACHINERY DISPLAY ----------

function displayMachines() {

    const container =
        document.getElementById("machineList");


    if (!container) return;


    container.innerHTML = "";


    machines.forEach(function(machine) {

        const card =
            document.createElement("div");

        card.className = "card";


        card.innerHTML = `

            <h3>🚜 ${machine.name}</h3>

            <p>
                ⚙️ Type:
                ${machine.type}
            </p>

            <p>
                👤 Owner:
                ${machine.owner}
            </p>

            <p>
                📍 Location:
                ${machine.location}
            </p>

            <div class="price">
                ₹${machine.rent} / day
            </div>

            <button
                onclick="rentMachine(${machine.id})"
            >
                🚜 Rent Machinery
            </button>
        `;


        container.appendChild(card);

    });
}


// ---------- RENT MACHINE ----------

function rentMachine(id) {

    const machine =
        machines.find(function(item) {

            return item.id === id;

        });


    if (!machine) return;


    const confirmRent =
        confirm(
            machine.name +
            "\nRent: ₹" +
            machine.rent +
            " / day\n\nContinue?"
        );


    if (!confirmRent) return;


    cart.push({

        id: Date.now(),

        productId: machine.id,

        type: "machinery",

        name: machine.name,

        price: machine.rent,

        quantity: 1,

        seller: machine.owner

    });


    saveData();

    updateCartCount();


    alert(
        "Machinery added to your rental cart!"
    );
}


// ---------- FERTILIZER DISPLAY ----------

function displayFertilizers() {

    const container =
        document.getElementById("fertilizerList");


    if (!container) return;


    container.innerHTML = "";


    fertilizers.forEach(function(item) {

        const card =
            document.createElement("div");

        card.className = "card";


        card.innerHTML = `

            <h3>🌱 ${item.name}</h3>

            <p>
                ${item.description}
            </p>

            <p>
                📦 ${item.quantity}
            </p>

            <div class="price">
                ₹${item.price}
            </div>

            <button
                onclick="addFertilizerToCart(${item.id})"
            >
                🛒 Add to Cart
            </button>
        `;


        container.appendChild(card);

    });
}


// ---------- ADD FERTILIZER TO CART ----------

function addFertilizerToCart(id) {

    const fertilizer =
        fertilizers.find(function(item) {

            return item.id === id;

        });


    if (!fertilizer) return;


    cart.push({

        id: Date.now(),

        productId: fertilizer.id,

        type: "fertilizer",

        name: fertilizer.name,

        price: fertilizer.price,

        quantity: 1,

        seller: "AgriConnect Organic Store"

    });


    saveData();

    updateCartCount();


    alert(
        fertilizer.name +
        " added to cart!"
    );
}


// ---------- CART COUNT ----------

function updateCartCount() {

    const count =
        document.getElementById("cartCount");


    if (count) {

        count.textContent =
            cart.length;

    }
}


// ---------- DISPLAY CART ----------

function displayCart() {

    const container =
        document.getElementById("cartList");


    const totalBox =
        document.getElementById("cartTotal");


    if (!container) return;


    container.innerHTML = "";


    if (cart.length === 0) {

        container.innerHTML =
            "<p>Your cart is empty.</p>";

        if (totalBox) {
            totalBox.textContent =
                "Total: ₹0";
        }

        return;
    }


    let total = 0;


    cart.forEach(function(item, index) {

        const itemTotal =
            item.price * item.quantity;


        total += itemTotal;


        const div =
            document.createElement("div");

        div.className = "cart-item";


        div.innerHTML = `

            <strong>
                ${item.name}
            </strong>

            <p>
                Type: ${item.type}
            </p>

            <p>
                ₹${item.price} ×
                ${item.quantity}
            </p>

            <button
                onclick="removeFromCart(${index})"
            >
                Remove
            </button>
        `;


        container.appendChild(div);

    });


    if (totalBox) {

        totalBox.textContent =
            "Total: ₹" + total;

    }
}


// ---------- REMOVE CART ITEM ----------

function removeFromCart(index) {

    cart.splice(index, 1);

    saveData();

    updateCartCount();

    displayCart();
}


// ---------- CHECKOUT ----------

function checkout() {

    if (cart.length === 0) {

        alert(
            "Your cart is empty."
        );

        return;
    }


    const user =
        JSON.parse(
            localStorage.getItem("agriUser")
        );


    if (!user) {

        alert(
            "Please login before placing an order."
        );

        openLogin();

        return;
    }


    let total = 0;


    cart.forEach(function(item) {

        total +=
            item.price *
            item.quantity;

    });


    const order = {

        id:
            "ORD" +
            Date.now(),

        customer:
            user.name,

        items:
            [...cart],

        total:
            total,

        status:
            "Order Placed",

        date:
            new Date().toLocaleString()

    };


    orders.unshift(order);


    cart = [];


    saveData();

    updateCartCount();

    displayCart();

    displayOrders();


    alert(
        "Order placed successfully!\n\n" +
        "Order ID: " +
        order.id
    );
}


// ---------- ORDER HISTORY ----------

function displayOrders() {

    const container =
        document.getElementById("orderList");


    if (!container) return;


    container.innerHTML = "";


    if (orders.length === 0) {

        container.innerHTML =
            "<p>No orders yet.</p>";

        return;
    }


    orders.forEach(function(order) {

        const div =
            document.createElement("div");

        div.className = "order-item";


        div.innerHTML = `

            <strong>
                ${order.id}
            </strong>

            <p>
                👤 ${order.customer}
            </p>

            <p>
                📅 ${order.date}
            </p>

            <p>
                💰 Total:
                ₹${order.total}
            </p>

            <p>
                🚚 Status:
                <strong>${order.status}</strong>
            </p>
        `;


        container.appendChild(div);

    });
}


// =====================================================
// WEATHER
// =====================================================

// Open-Meteo is used here.
// No API key is required.

async function getWeather() {

    const cityInput =
        document.getElementById("cityInput");


    const city =
        cityInput.value.trim();


    if (city === "") {

        alert(
            "Please enter a city name."
        );

        return;
    }


    const status =
        document.getElementById(
            "weatherStatus"
        );


    if (status) {

        status.textContent =
            "Loading weather...";

    }


    try {

        // Find city coordinates

        const geoResponse =
            await fetch(
                "https://geocoding-api.open-meteo.com/v1/search?name=" +
                encodeURIComponent(city) +
                "&count=1&language=en&format=json"
            );


        if (!geoResponse.ok) {

            throw new Error(
                "Location search failed"
            );

        }


        const geoData =
            await geoResponse.json();


        if (
            !geoData.results ||
            geoData.results.length === 0
        ) {

            throw new Error(
                "City not found"
            );

        }


        const location =
            geoData.results[0];


        const latitude =
            location.latitude;


        const longitude =
            location.longitude;


        // Get live weather

        const weatherResponse =
            await fetch(
                "https://api.open-meteo.com/v1/forecast?" +
                "latitude=" +
                latitude +
                "&longitude=" +
                longitude +
                "&current=" +
                "temperature_2m,relative_humidity_2m,wind_speed_10m,rain" +
                "&wind_speed_unit=kmh"
            );


        if (!weatherResponse.ok) {

            throw new Error(
                "Weather request failed"
            );

        }


        const weatherData =
            await weatherResponse.json();


        const current =
            weatherData.current;


        document.getElementById(
            "temperature"
        ).textContent =
            current.temperature_2m +
            " °C";


        document.getElementById(
            "humidity"
        ).textContent =
            current.relative_humidity_2m +
            " %";


        document.getElementById(
            "windSpeed"
        ).textContent =
            current.wind_speed_10m +
            " km/h";


        document.getElementById(
            "rain"
        ).textContent =
            current.rain +
            " mm";


        if (status) {

            status.textContent =
                "📍 " +
                location.name +
                ", " +
                (location.country || "") +
                " • Live weather data";

        }

    }

    catch (error) {

        console.error(error);


        if (status) {

            status.textContent =
                "Unable to get weather. Please check the city name or internet connection.";

        }

    }
}


// =====================================================
// CROP PRICE PREDICTION
// =====================================================

function predictPrice() {

    const crop =
        document.getElementById(
            "predictionCrop"
        ).value;


    const currentPrice =
        Number(
            document.getElementById(
                "currentPrice"
            ).value
        );


    const result =
        document.getElementById(
            "predictionResult"
        );


    if (
        !currentPrice ||
        currentPrice <= 0
    ) {

        result.innerHTML =
            "Please enter a valid current price.";

        return;
    }


    // Demo prediction factors.
    // Later we can connect a real ML model.

    const factors = {

        Tomato: 1.08,

        Onion: 0.94,

        Rice: 1.06,

        Potato: 1.07,

        Banana: 1.04

    };


    const factor =
        factors[crop] || 1.05;


    const predicted =
        currentPrice * factor;


    const difference =
        predicted - currentPrice;


    const percentage =
        (
            (difference /
                currentPrice) *
            100
        ).toFixed(1);


    let trend;


    if (difference > 0) {

        trend =
            "📈 Price may increase";

    }

    else if (difference < 0) {

        trend =
            "📉 Price may decrease";

    }

    else {

        trend =
            "➡️ Price may remain stable";

    }


    result.innerHTML = `

        <h3>
            🔮 ${crop} Prediction
        </h3>

        <p>
            Current Price:
            <strong>
                ₹${currentPrice.toFixed(2)}
            </strong>
        </p>

        <p>
            Expected Price:
            <strong>
                ₹${predicted.toFixed(2)}
            </strong>
        </p>

        <p>
            Change:
            <strong>
                ${percentage}%
            </strong>
        </p>

        <p>
            ${trend}
        </p>

        <small>
            This is a demo prediction model.
            Real market data + ML can be connected later.
        </small>
    `;
}


// =====================================================
// INITIALIZE
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        displayFarmerCrops();

        displayCrops();

        displayMachines();

        displayFertilizers();

        displayCart();

        displayOrders();

        updateCartCount();

    }
);