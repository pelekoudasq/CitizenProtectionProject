# Citizen Protection Project
###### Εργασία για το Μάθημα `Τεχνολογία Λογισμικού` (Ομάδα 7)

Υλοποιήθηκε από τους:
---------------------

* [Θεόφιλος Κανταρτζής](https://github.com/TheoKant/ "Theophilos Kantartzis") `sdi1400061@di.uoa.gr`
* [Βασιλική Κουμαρέλα](https://github.com/VasiaKoum/ "Vasiliki Koumarela") `sdi1600074@di.uoa.gr`
* [Σοφία Κωστακόντη](https://github.com/SofiaKstk/ "Sofia Kostakonti") `sdi1500080@di.uoa.gr`
* [Δημήτρης Παπαχρήστου](https://github.com/dimpapac/ "Dimitris Papachristou") `sdi1500124@di.uoa.gr`
* [Ιωάννης Πελεκούδας](https://github.com/pelekoudasq/ "Ioannis Pelekoudas") `sdi1500128@di.uoa.gr`
* [Γεώργιος Σκούρας](https://github.com/GaSkouras/ "Georgios Skouras") `sdi1400309@di.uoa.gr`

Αρχεία Τεκμηρίωσης
------------------
* [Software Requirements Specification](./docs/SRS.md)
* [Wireframes](./docs/UI.md)
* [UML Diagrams](./docs/uml)

Απαιτήσεις συστήματος
---------------------

* nodejs
* npm

Κλωνοποίηση αποθετηρίου
-----------------------
```bash
git clone git://github.com/pelekoudasq/bidit.git
cd CitizenProtectionProject
```

Εγκατάσταση και εκτέλεση Frontend
---------------------------------

Τεχνολογίες: React

```bash
cd front-end
npm install -g
npm start
```
Ύστερα, πλοήγηση στη σελίδα `http://localhost:3000/`


Εγκατάσταση και εκτέλεση Backend
--------------------------------

Τεχνολογίες: MongoDB w/ Node, Express

```bash
cd back-end
npm install -g
node server
```

Test back-end
-------------

```bash
npm test
```
##### FunctionalTests:

✅ T01. Health check status is OK  
✅ T02. The database is reset successfully  
✅ T03. Admin logs in successfully  
✅ T04. Admin creates a temp user  
✅ T05. Admin updates the temp user  
✅ T06. Temp user logs in  
✅ T07. Temp user creates a new incident  
✅ T08. Temp user retrieves a list of incidents  
✅ T09. Temp user updates an incident  
✅ T10. Temp user retrieves an incident  
✅ T11. Temp user deletes an incident  
✅ T12. Temp user logs out  
✅ T13. Admin deletes the temp user  
✅ T14. Admin logs out  

##### RobotTests:

❌ RT01. Health check status is OK  
❌ RT02. The database is reset successfully  
❌ RT03. Admin logs in successfully  
❌ RT04. Admin creates multiple users  
❌ RT05. Admin updates one user and deletes the rest of the users  
❌ RT06. User logs in  
❌ RT07. User manages a list of incidents  
❌ RT08. User logs out  
❌ RT09. Admin deletes the remaining user  
❌ RT10. Admin logs out  



Εκτέλεση front & back
---------------------
```bash
cd back-end
npm run dev
```

Εγκατάσταση και εκτέλεση cli
----------------------------
```bash
cd cli-app/control-center
npm install -g
npm link
control-center
```	
