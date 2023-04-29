
This is team web maniacs, A first year team from NIT Silchar, and the problem statement we chose was-
2. Predictive policing which involves issuing advisory (how likely a crime can happen) to people who visit a certain place/city/country during a certain time.
OVERVIEW
To solve this problem statement, we decided to make a Tourist utility Web Application named “TRAVELSAFE” where the tourist will enter his destination, duration and time of visit, and then our website with help the data entered from the police stations end will send him a reply within the website informing him about how safe the place he’ll visit is.
DESCRITION
For this we have made mainly 4 web pages, one landing page, one police login page one tourist side page, and one page for police to update the crime log. 
On the landing page the police operator can click on “police section” which would redirect him to his login page where he can login with username and password and would be redirected to the police website, the username and password would be provided to the data personnel of the police station by us after proper training and authentication (for reference currently we have applied google sign in and username and password-based sign in). While the tourist doesn’t have to register or login separately, there would be a “Check Your Safety” button on the landing page which would redirect him directly to the tourist side page.
On the police side page, named “TRAVELSAFE SECURITY”, the police personnel would be given the option to log a crime in the table provided. Each crime log would have Date of crime, Category of crime, Place of crime and Level of crime, these records would be stored in the MongoDB data base at the backend.
Categories of crime:
1.	VC-Violent crimes: Rape, Murder, assault.
2.	PC-Property crimes: Theft, Burglary, Vandalism.
3.	DC-Drug crimes: Possession, and sale of illegal drugs.
4.	TC-Traffic Crimes: Reckless driving and Hit and run.
5.	WCC-White Collar crimes: Bribery, Extortion.
Level of crime (Defined by us):
•	VC – Level 5
•	DC – Level 4
•	WCC – Level 3
•	PC - Level 2
•	TC – Level 1
##The level of crime Depicts its severity, which we would be using in the algorithm to analyze the Crime rating of the place.
The user side page, named “TRAVELSIDE”, would be a very simple website where the tourist would enter his place of visit and date of visit anonymously. The backend algorithem would use the CPU time of the user side pc and the place of his visit to sort the database for running the query which would provide the values of no. of crimes and the serverity (level) average to the algorithm, which would analyze run calculations based on the backend logic and provide a crime rating to the user on the userside page. This would be a simple color graded rating, consisting of 3 colors:
•	Red: Unsafe (visit not advisable)
•	Yellow: Partially safe(not too unsafe)
•	Green: Safe for visit.
Currently, the message is being displayed on a new webpage.


BACKEND LOGIC
We retrieve the CPU timing of the user laptop, we would check dates of the 1 week back from this date and use the location from user side page, we would sort the MongoDB data base based on it. 
After that we would take no. of time each type of crime was committed in the week and multiply it with the level of each respective crime and then add all those and then divide it by 7(Average severity).
If result<8 --- Green
If 8<result<16 --- Yellow
If result> 16 --- Red

PLease have a look at the file named backend_algo.js for the rough framework of the backend logic.

DATABASE
For database we have used MongoDB and integrated it using mongoose and to run the code we have used ExpressJS. In data base fields given are crime_rating(level), city(place), date, crime(category).
and using mongoose we are filling this table from police webpage table.
ExpressJS is used to run and check this code.
on this database the backend logic could be run to give the crime rating(colorgraded) as output to the tourist webpage.

FUTURE SCOPE
For now, as we don’t have the dataset nor the expertise to predict the crime rate around the future date when the tourist is going to visit the destination, we are using the previous week from the date of searches conducted by the user. But we have given an option for the user to enter his date of visit and duration of visit, so in future, using a Machine learning and a bigger data set (a whole year’s data) we would create a crime rate predicting mechanism which predicts the crime rate for the time around which the tourist is visiting his destination.
If we work as an organization, we can increase the reach of the website and also make the police registration process more secure by giving the police station an authentication and training mechanism within the website. More reach can help us create a vast data base.
In future we also plan to increase the number of Crime Levels from 5 to 40. And also add another para meter in the backend logic which is the Severity of crime committed in one day in relation to the maximum number of crimes committed in one day in that week.
