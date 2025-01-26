# Important information for Deadline 1


:bangbang:&nbsp;&nbsp;**This chapter should be completed by Deadline 1** *(see course information at [Lovelace](http://lovelace.oulu.fi/ohjelmoitava-web/ohjelmoitava-web/))*

---
<details>
<summary>
:bookmark_tabs:&nbsp;&nbsp;<strong>Chapter summary</strong>
</summary>

<bloquote>
This chapter must provide a good overview of the Web API that your group is going to develop during the course, and some insight into the (imaginary) microservice architecture it will be a part of. You should not focus in implementation aspects such as database structure,  interfaces or the request/responses formats. We recommend that you look into existing APIs (see Related work below) before writing the description for your own API.

<h3>Chapter GOALS:</h3>
<ol>
<li>Understand what is an API</li>
<li>Describe the project topic API</li>
<li>Describe how the API would be used as part of a larger architecture</li>
</ol>
</bloquote>

</details>

---

<details>
<summary>
:heavy_check_mark:&nbsp;&nbsp;&nbsp;&nbsp; <strong>Chapter evaluation (max 5 points)</strong>
</summary>

<bloquote>
You can get a maximum of 5 points after completing this Chapter. More detailed evaluation is provided in the evaluation sheet in Lovelace.
</bloquote>

</details>

---

# RESTful API description
## Overview
<details>
<summary>
:bookmark_tabs:&nbsp;&nbsp;<strong>Content that must be included in the section</strong>
</summary>

<bloquote>

Describe the API you are going to implement. Also describe the larger imaginary architecture that would exist around that API - while you do not need to implement these other components, they will be helpful in imagining context for your API. Your API will be a component that stores, and offers an interface to, some important data in the larger ecosystem. Think about a larger system, and then take out one key piece to examine - this will be your API.

Describe the API briefly and comment what is the main functionality that it exposes. Focus in the API not in any specific application that is using this API. Take into account that in the end, a WEB API is an encapsulated functionality as well as the interface to access that functionality. Remember that your API is just one part of a larger machine. It does not need to do everything. There will be other components in the system to do those things. This course focuses on creating a small API in detail - thinking too big from the start will drown you in work later. 

A really short version of an overview for the RESTful Web API could be: 

<em>“The discussion forum Web API offers different functionalities to structure non-real-time conversations among the people of a group about topics they are interested in certain topic. Messages are grouped in Threads, that at the same time are grouped in Topics. The messages are accessible to anyone, but posts can only be created by providing credentials of a registered user [...] This API could exist as part of an online learning environment system where it is responsible for offering discussion forum features that can be included in other components of the learning environment. For example, a programming task (managed by a different component) can include its own discussion board managed by the discussion forum API[...]“</em>

</bloquote>

</details>

---

:pencil2: 
<em>“The Auction house API offers users to bid on list of items that are in auction. Authenticated users can add items, add them to categories and list them to auction. Items can be put to auction for set off time and people can search for items that belongs in different categories, but if you want to add bid for an item you need to be registered. For this there is need to add items in certain category and item contains its own basic information (e.g. description, start price, owner). For adding a bid there should be authentication, so there is way to now who did the bid. Users can also serch used or new items based on their preference. 

There is many use cases for auction house API. It could be part of enforcement agencies where items that are seized and put to auction or collectible auction, where art pieces can be put for auction. Both private and public sector can use it for auctioning items for both examples there could be own site that includes items that are seized or there are collectibles.“</em>

---


## Main concepts and relations
<details>
<summary>
:bookmark_tabs:&nbsp;&nbsp;<strong>Content that must be included in the section</strong>
</summary>

<bloquote>
<strong>Define</strong> the <strong>main concepts</strong> and describe the <strong>relations</strong> among them textually. Roughly, a concept is a real-world entity that is expected to be of interest to users or other services. This section will be a guideline for choosing your resources to implement in Deadline 3. Students should remember that some of the concepts might not be a resource by themselves, but just a part of it (resource property). In this section, students should not describe the RESTful resources, but identify which are the main ideas of the API. Do not forget to include the relations among the concepts.

A description of the main concepts for the Forum API could be: 

<em>"The API permits users send messages. The forum contains a list of categories and a list of users. Each category specifies a name, a description and a thread. A thread is [...]The forum may contain 0 or more categories… Each category may have 0 or more threads… Users can write and read messages to a forum thread. A user has a profile, basic information, activity information (stores, for instance, all the messages sent by a user, the messages marked as favorites). [...]The user history contains information of the last x amount of messages sent by the user.[…]"</em>

Include a diagram which shows the relations among concepts.

This section is important because it outlines the concepts that you will later implement. In particular, the diagram defined here will follow you throughout the project report and you will be adding more details to it. 


</bloquote>

</details>

---

:pencil2:
<em>"The auction house contains users, auctions, items and bids. Item can be put to auction and the item can be new/used. Auction of course contains bids that are done by users. Auctioned item may contain 0 or more bids, but the bids most be done by user that is authenticated. Everyone can look at the auctions only the bidding is controlled by authentication. 

The API of Auction House also alerts its users for new auctions or objects in an area in which they had already declared their interest. Users could establish the highest bid for an item. This would permit the system to submit bids for the buyers up until the end of their limit. 
"</em>
![Auction UML Diagram](uploads/448d6edbd82d4784e9aff04dcbb1c60c/AuctionDiagram.png)

Auction house API table:
| Resource      | URI                   | GET | POST | PUT | DELETE | 
| ------------- | -------------         | --  | ---- | --  | -----  | 
| Item          | /api/item/{item_id}/  | x | x | x | x | 
| Items         | /api/items/           | x | x | - | - | 
| User          | /api/user/{user_id}/  | x | x | x | x | 
| Users         | /api/users/           | x | x | - | - | 
| Auction       | /api/auction/{auction_id} | x | x | - | x | 
| Auctions      | /api/auctions/         | x | - | - | x | 
| Bid      | /api/bid/{bid_id}         | x | x | - | x | 
| Bids      | /api/bids/         | x | - | - | x | 
| Categories      | /api/categories/         | x | x | - | x | 
| Register      | /api/register/         | - | x | - | - | 
| Login      | /api/login/{user_id}         | - | x | - | - | 


CLI application can be used to communicate with the auction house api. Here is example Client action list that can be done:
1. Fetch Users (GET /users)
    - Retrieve a list of all users and display their IDs and names
2. Fetch Items (GET /items)
    - Retrieve a list of all items and display their names, descriptions, and associated category IDs
3. Fetch Categories (GET /categories)
    - Retrieve a list of all categories and display their names and descriptions
4. Create a New User (POST /users)
    - Add a new user by providing their name, email, and other details
5. Create a New Item (POST /items)
    - Add a new item under a specific category and associate it with a seller (user)
6. Update a Category (PUT /categories/id)
    - Update the name or description of a specific category
7. Delete an Item (DELETE /items/id)
    - Remove an item from the database
8. Register user (POST /register)
    - Register user for first time
9. Login user (POST /login/id)
    - Login as user

For Auxiliary Service we are thinking about an independent service that monitors auctions and notifies users about auctions nearing their end

![Auction house](uploads/448d6edbd82d4784e9aff04dcbb1c60c/auction_house.png)
---

## API uses
<details>
<summary>
:bookmark_tabs:&nbsp;&nbsp;<strong>Content that must be included in the section</strong>
</summary>

<bloquote>
Describe at least one client and one service that could use your Web API. You must explain here what is the functionality provided by the client/service, and how it uses the Web API to implement this functionality. 
</bloquote>

</details>

---

:pencil2:
Applications developed to browse auction items will be interested in using the Auction House API. To make the app usable for different users, the Item Search API (GET /items?category=new) is used to find a category of items within the application. In this way, the application will support the fast tracking of goods.


## Related work
<details>
<summary>
:bookmark_tabs:&nbsp;&nbsp;<strong>Content that must be included in the section</strong>
</summary>

<bloquote>
Find at least one API that resembles the functionality provided by yours. Explain in detail the functionality provided by the API. Classify the API according to its type (RPC, CRUD REST, pure REST, hypermedia driven ...) justifying your selection. Provide at least one example client that uses this API.

The purpose of this task is to get more familiar with what an API is. This will be helpful in describing your own API. Therefore, it is recommended to do this section after you have decided the topic of your project but before writing your API description.
</bloquote>

</details>

---



:pencil2:
eBay’s Trading API is a similar sort of API likely to the Auction House API. It supports online auctions for managing, creating, and searching auction listings. Also, it has capabilities like listing items, bidding, and searching products in categories or using filters. Therefore, this is another CRUD REST API. CRUD is unique as it involves standard HTTP operations such as GET, POST, and PUT as of creation, read, update, and delete. As some people argue, the API is not a fully hypermedia REST API. Most client applications use this API, such as the eBay Mobile App, to list items, like the platform for bidding, and for tracking auction results.


---


## Resources allocation
|**Task** | **Student**|**Estimated time**|
|:------: |:----------:|:----------------:|
|Documentation|Md Mobusshar Islam|3h| 
|Documentation|Miiro Kuosmanen|3h| 
|Documentation|Haseeb Rehman|3h| 
|Documentation|Toni Kolehmainen|3h| 
