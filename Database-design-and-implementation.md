# Important information for Deadline 2

:bangbang:&nbsp;&nbsp;**This chapter should be completed by Deadline 2** *(see course information at [Lovelace](http://lovelace.oulu.fi))*

---
<details>
<summary>
:bookmark_tabs:&nbsp;&nbsp;<strong>Content that must be included in the chapter</strong>
</summary>

<bloquote>
In this section students must design and implement the back end system (mainly its database).

In this section you must implement:
<ul>
<li>The database table structure.</li>
<li>The data models (ORM)</li>
<li>Data models access methods (if needed)</li>
<li>Populating the database using the models you have created</li>
<li>A Unit test showing that your ORM works as expected</li>

<ul>
</bloquote>
<strong>In this section you should aim for a high quality small implementation instead of implementing a lot of features containing bugs and lack of proper documentation.</strong>
<h3>SECTION GOALS:</h3>
<ol>
<li>Understand database basics</li>
<li>Understand how to use ORM to create database schema and populate a database</li>
<li>Setup and configure database</li>
<li>Implement database backend</li>
<li>Write tests</li>
</ol>
</details>

---

---
<details>
<summary>
:heavy_check_mark:&nbsp;&nbsp;&nbsp;&nbsp; <strong>Evaluation criteria(max 15 points)</strong>
</summary>

<bloquote>
You can get a maximum of 15 points after completing this section. More detailed evaluation is provided after each heading.
</bloquote>

</details>

---

# Database design and implementation

## Database design
---
<details>
<summary>
:bookmark_tabs:&nbsp;&nbsp;<strong>Content that must be included in the section</strong>
</summary>

<bloquote>
Describe your database. The documentation must include:
<ul>
<li>A name and a short description of each database table (or data models in case of non relational database). Describe in one or two sentences what the table represents.</li>
<li>An enumeration of the attributes (columns) of each table. Each attribute must include:
	<ul>
		<li>Its type and restrictions (values that can take)</li>
		<li>A short description of the attribute whenever the name is not explicit enough. E.g. If you are describing the users of a "forum", it is not necessary to explain the attributes "name", "surname" or "address" </li>because their meanings are obvious.
		<li>Characteristics of this attribute (e.g. if it is unique, if it contains default values)</li>
	</ul>
</li>
<li>Connection with other tables (primary keys and foreign keys)</li>
<li>Other keys</li>
</ul>
You can use the table skeleton provided below

For this section you can use a visual tool to generate a diagram. Be sure that the digram contains all the information provided in the tables. Some tools you can use include: <a href="https://dbdesigner.net">https://dbdesigner.net/</a>, <a href="https://www.lucidchart.com/pages/tour/ER_diagram_tool">https://www.lucidchart.com/pages/tour/ER_diagram_tool</a>, <a href="https://dbdiffo.com/">https://dbdiffo.com/</a>

</bloquote>

</details>

---

---
<details>
<summary>
:heavy_check_mark:&nbsp;&nbsp;&nbsp;&nbsp; <strong>Evaluation criteria(max 3 points)</strong>
</summary>

<bloquote>
You can get a maximum of 3 points after completing this section.
<ul>
<li>Design of database is coherent.Correct usage of tables and foreign keys: <strong>1.0</strong></li>
<li>Each table and its columns are named: <strong>0.5</strong></li>
<li>Details for columns are provided (datatype, default value, characteristics etc.): <strong>0.5</strong></li>
<li>Foreign keys follow the relationship diagram from deadline 1: <strong>1.0</strong>
	<ul></li>
		if necessary, you can update your diagram 
	</li></ul>
</li>
</ul>
</bloquote>

</details>

---

:pencil2: *The table can have the following structure*
|**Name** | **Type**|**Restrictions**|**Description**|**Characteristics** | **Links**|
|:------: |:-------:|:--------------:|:-------------:|:-----------------: |:--------:|
|Name of the attribute|Attribute type|Values that the type can take|Description of the attribute|Uniquenes, default...| keys and foreign keys|
|||||| 
|||||| 
|||||| 

:pencil2: *Do not forget to include a diagram presenting the relations*

## Database implementation
---
<details>
<summary>
:computer:&nbsp;&nbsp;&nbsp;&nbsp; <strong>TODO: SOFTWARE TO DELIVER IN THIS SECTION</strong>
</summary>

<bloquote>
<strong>The code repository must contain: </strong>
<ol>
<li>The ORM models and functions</li>
<li>A <var>.sql dump</var> of a database or the <var>.db file</var> (if you are using SQlite). You must provide a populated database in order to test your database API.</li>
<li>The scripts used to generate your database (if any)</li>
<li>If you are using python, the requirements.txt file.</li> 
<li>The code to test your database (unit test). </li>
<li>
	<ul>
		<li>The code of the test MUST be commented indicating what are you testing in each case.</li>
		<li>The test must include values that force error messages.</li>
		<li>We highly recommend that your test show an output to the console telling what you have done (not only if it passed the test or not).</li>
	</ul>
</li>
<li>We recommend to include a set of scripts to setup your database and run your tests.</li>
<li>A README.md file containing:</li>
<li>
	<ul>
		<li>All dependencies (external libraries) and how to install them (Include also dependencies of your testing suite)</li>
		<li>Define database and version utilized</li>
		<li>Instructions how to setup the database framework and external libraries you might have used, or a link where it is clearly explained. </li>
		<li>Instructions on how to setup and populate the database.</li>
		<li>Instruction on how to run the tests of your database.</li>

	</ul>
<li>
</ol>
NOTE: Your code MUST be clearly documented. For each public method/function you must provide: a short description of the method, input parameters, output parameters, exceptions (when the application can fail and how to handle such fail). Check Exercise 1 for examples on how to document the code.

Example documentation
<code>
def delete_message(self, messageid):
       '''
       Delete the message with id given as parameter.
 
       :param str messageid: id of the message to remove.Note that messageid
           is a string with format ``msg-\d{1,3}``
       :return: True if the message has been deleted, False otherwise
       :raises ValueError: if the messageId has a wrong format.
 
       '''
</code>
<strong> addition, should be clear which is the code you have implemented yourself and which is the code that you have borrowed from other sources.</strong>


</bloquote>

</details>

---

---
<details>
<summary>
:heavy_check_mark:&nbsp;&nbsp;&nbsp;&nbsp; <strong>Evaluation criteria(max 3.5 points)</strong>
</summary>

<bloquote>
<ul>
	<li>Instructions to set up the database and run the tests are provided in the README.md file: <strong>0.5</strong>
		<ul>
			<li>this means there should be no undocumented extra steps in running the code/tests!</li>
		</ul>
	</li>
	<li>The code has clear structure and naming for variables and methods: <strong>1.0</strong></li>
	<li>You have clearly marked which parts of the code are your own work and which part of the code is borrowed: <strong>0.5</strong></li>
	<li>Each method's functionality is described in its documentation: <strong>0.5</strong></li>
	<li>Return value(s) (name, type, description for each) are documented: <strong>0.5</strong></li>
	<li>Exceptions (type, what causes it) are documented: <strong>0.5</strong></li>
	<li>Code documentation uses a consistent and clear format: <strong>1.0</strong>
		<ul>
		<li>you can use an existing documenting format (e.g. Sphinx for Python) or simply come up with your own - as long as it's consistent</li>
		</ul>
	</li>
</ul>
</bloquote>

</details>

---
:pencil2: *You do not need to write anything in this section, just complete the implementation.*

### Database testing
---
<details>
<summary>
:bookmark_tabs:&nbsp;&nbsp;<strong>Software that must be included in the section</strong>
</summary>

<bloquote>
In this course, showing that your code works is primarily your responsibility. Therefore we expect test cases that show that all of your methods work not just with correct parameters, but that they also handle error situations correctly. Tests should always cover the most common error scenarios that are easy to predict (e.g. trying to edit something that doesn't exist, trying to create duplicate primary keys etc.) Each test case has to clearly show what it tests, what test parameters it uses and finally to show that result was as expected.
</bloquote>

</details>

---

---
<details>
<summary>
:heavy_check_mark:&nbsp;&nbsp;&nbsp;&nbsp; <strong>Evaluation criteria(max 7.0 points)</strong>
</summary>

<bloquote>
In this section you can get a maximum of 7.0 points.
<ul>
<li>The test case cover all methods implemented in the database: <strong>1.0</strong> (0.5 if not all methods covered / 0 if just a few methods covered)</li>
<li>Each method is tested with correct parameters: <strong>1.0</strong></li>
<li>Test cases cover all predictable error scenarios for all methods: <strong>1.5</strong></li>
<li>Test output clearly describes the testing process for each case: <strong>1.5</strong></li>
<li>The interface works as intended (i.e. we don't find any errors): <strong>2.0</strong></li></ul>

</bloquote>

</details>

:pencil2: *You do not need to write anything here. Just complete the implementation*

---
## Resources allocation 
|**Task** | **Student**|**Estimated time**|
|:------: |:----------:|:----------------:|
|||| 
|||| 
|||| 
|||| 
|||| 