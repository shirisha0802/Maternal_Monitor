import os
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report, roc_auc_score


def main():

    # ===== Load Dataset =====
    df = pd.read_csv("../data/MaternalDS.csv", encoding="utf-8-sig")
    df.columns = df.columns.str.replace("ï»¿", "")

    print("Columns:", df.columns.tolist())

    # ===== Split Features & Target =====
    X = df.drop("RiskLevel", axis=1)
    y = df["RiskLevel"]

    # ===== Encode Target =====
    le = LabelEncoder()
    y = le.fit_transform(y)

    print("Classes:", le.classes_)

    # ===== Train Test Split =====
    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=0.2,
        random_state=42
    )

    # ===== Model (Your Tuned Params) =====
    model = RandomForestClassifier(
        n_estimators=300,
        max_depth=20,
        criterion="entropy",
        random_state=42
    )

    model.fit(X_train, y_train)

    # ===== Evaluation =====
    y_pred = model.predict(X_test)
    probs = model.predict_proba(X_test)

    print("\nAccuracy:", accuracy_score(y_test, y_pred))
    print("ROC-AUC:", roc_auc_score(y_test, probs, multi_class="ovr"))
    print("\nClassification Report:\n")
    print(classification_report(y_test, y_pred))

    # ===== Save Model =====
    os.makedirs("../models", exist_ok=True)

    joblib.dump(model, "../models/risk_model.pkl")
    joblib.dump(le, "../models/label_encoder.pkl")

    print("\nModel saved successfully!")


if __name__ == "__main__":
    main()