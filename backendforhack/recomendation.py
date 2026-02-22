def recommend_food(deficiency_type):

    food_map = {

        0: {
            "deficiency": "No Deficiency",
            "foods": [
                "Balanced diet",
                "Fruits and vegetables",
                "Whole grains",
                "Adequate hydration"
            ]
        },

        1: {
            "deficiency": "Iron Deficiency",
            "foods": [
                "Spinach",
                "Lentils",
                "Dates",
                "Red meat",
                "Jaggery"
            ]
        },

        2: {
            "deficiency": "Protein Deficiency",
            "foods": [
                "Eggs",
                "Chicken",
                "Paneer",
                "Soybeans",
                "Dal"
            ]
        },

        3: {
            "deficiency": "Calcium Deficiency",
            "foods": [
                "Milk",
                "Yogurt",
                "Almonds",
                "Broccoli",
                "Ragi"
            ]
        },

        4: {
            "deficiency": "Multi Nutrient Deficiency",
            "foods": [
                "Balanced high-protein diet",
                "Green leafy vegetables",
                "Milk and dairy",
                "Iron-rich foods",
                "Consult nutritionist"
            ]
        }
    }

    return food_map.get(deficiency_type, {
        "deficiency": "Unknown",
        "foods": ["Consult healthcare professional"]
    })