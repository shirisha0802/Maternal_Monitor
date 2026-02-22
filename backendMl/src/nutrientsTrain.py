import os
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, roc_auc_score


def main():

    # =============================
    # 1️⃣ Setup Base Paths (Safe)
    # =============================
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    DATA_PATH = os.path.join(BASE_DIR, "data", "nutrient_data.csv")
    MODEL_DIR = os.path.join(BASE_DIR, "models")

    # =============================
    # 2️⃣ Load Dataset
    # =============================
    df = pd.read_csv(DATA_PATH)

    print("Dataset shape:", df.shape)
    print("Class distribution:\n", df["deficiency_type"].value_counts())

    # =============================
    # 3️⃣ Define Features & Target
    # =============================
    X = df.drop("deficiency_type", axis=1)
    y = df["deficiency_type"]

    # =============================
    # 4️⃣ Train-Test Split
    # =============================
    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=0.2,
        random_state=42,
        stratify=y
    )

    # =============================
    # 5️⃣ GridSearch Setup
    # =============================
    param_grid = {
        "n_estimators": [100, 200, 300],
        "max_depth": [None, 10, 20],
        "min_samples_split": [2, 5],
        "min_samples_leaf": [1, 2],
        "criterion": ["gini", "entropy"]
    }

    rf = RandomForestClassifier(random_state=42)

    grid = GridSearchCV(
        rf,
        param_grid,
        cv=5,
        scoring="accuracy",
        n_jobs=-1
    )

    # =============================
    # 6️⃣ Train Model
    # =============================
    print("\nTraining with GridSearch...")
    grid.fit(X_train, y_train)

    print("\nBest Parameters:", grid.best_params_)
    print("Best CV Accuracy:", round(grid.best_score_, 4))

    # =============================
    # 7️⃣ Evaluate on Test Set
    # =============================
    best_model = grid.best_estimator_
    y_pred = best_model.predict(X_test)
    probs = best_model.predict_proba(X_test)

    test_accuracy = accuracy_score(y_test, y_pred)
    roc_auc = roc_auc_score(y_test, probs, multi_class="ovr")

    print("\n===== Test Performance =====")
    print("Test Accuracy:", round(test_accuracy, 4))
    print("ROC-AUC:", round(roc_auc, 4))
    print("\nClassification Report:\n")
    print(classification_report(y_test, y_pred))

    # =============================
    # 8️⃣ Save Model
    # =============================
    os.makedirs(MODEL_DIR, exist_ok=True)

    model_path = os.path.join(MODEL_DIR, "nutrient_model.pkl")
    joblib.dump(best_model, model_path)

    print("\nModel saved at:", model_path)
    print("Training completed successfully!")


if __name__ == "__main__":
    main()