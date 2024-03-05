import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate("pyproj-b0060-firebase-adminsdk-kir2q-4310ef6d2e.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

def dodaj_ucznia(Name, Surname):
    students_ref = db.collection("3a")
    new_student_ref = students_ref.add({
        "Name": Name,
        "Surname": Surname
    })

    print(f"Dodano nowego ucznia o ID: {new_student_ref[1].id}")

dodaj_ucznia("Kacper", "Grucha")