README
This is team web maniacs, A first year team from NIT Silchar, and the problem statement we chose was-
2. Predictive policing which involves issuing advisory (how likely a crime can happen) to people who visit a certain place/city/country during a certain time.
OVERVIEW
To solve this problem statement, we decided to make a Tourist utility Web Application named “TRAVELSAFE” where the tourist will enter his destination, duration and time of visit, and then our website with help the data entered from the police stations end will send him a reply within the website informing him about how safe the place he’ll visit is.
DESCRITION
For this we have made mainly 3 web pages, one landing page, one tourist side page, and one page for police to update the crime log. 
On the landing page the the police operator can login with username and password and would be redirected to the police website, the username and password would be provided to the data personnel of the police station by us after proper training and authentication. While the tourist doesn’t have to register or login separately, there would be a Travel button on the landing page which would redirect him directly to the tourist side page.
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
•	TC - Level 2
•	PC – Level 1
##The level of crime Depicts its severity, which we would be using in the algorithm to analyze the Crime rating of the place.
The user side page, named “TRAVELSIDE”, would be a very simple website where the tourist would enter his place of visit and date of visit anonymously. The backend algorithem would use the CPU time of the user side pc and the place of his visit to sort the database for running the query which would provide the values of no. of crimes and the serverity (level) average to the algorithm, which would analyze run calculations based on the backend logic and provide a crime rating to the user on the userside page. This would be a simple color graded rating, consisting of 3 colors:
•	Red: Unsafe (visit not advisable)
•	Yellow: Partially safe(not too unsafe)
•	Green: Safe for visit.

BACKEND LOGIC
When we receive the cpu timing of the user laptop, we would check dates of the 6 days back from this date and use the location from userside page, we would sort the MongoDB data base based on it. 
After that we would take no. of time each type of crime was committed in the week and multiply it with the level of each respective crime and then add all those and then divide it by 7(Average severity).
If result<8 --- Green
If  8<result<16 --- Yellow
If result> 16 --- Red

Because of time constraint we could not complete the whole backend logic and integration, we apologize for that. But we have provided the whole MongoDB database for storing crime logs which is functional on the website and a rough framework of the backend logic using javascript.
