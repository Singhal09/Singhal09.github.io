"use strict";

//IIFE - Immediately Invoked Function Expression
//AKA - Anonymous Self-Executing Function
(function(){

    /**
     * Instantiate and contact to LocalStorage.
     * @param fullName
     * @param contactNumber
     * @param emailAddress
     * @constructor
     */
    function AddContact(fullName,contactNumber,emailAddress) {

        let contact = new core.Contact(fullName, contactNumber, emailAddress);
        if (contact.serialize()) {
            let key = contact.FullName.substring(0, 1) + Date.now();
            localStorage.setItem(key, contact.serialize());
        }
    }

    function DisplayHomePage(){
        console.log("Display Home Page called");

        let xhr = new XMLHttpRequest();

        xhr.addEventListener("readystatechange", () => {
            if( xhr.readyState === 4 && xhr.status === 200){

                //console.log(xhr.responseText);
                $("header").html(xhr.responseText);
            }
        });

        xhr.open("GET", "header.html");
        $("#AboutUsBtn").on("click", () => {
            location.href = "about.html"
        });
        $("main").append(`<p class="mt-3" id="MainParagraph">This is jquery generated paragraph</p> `);
        $("body").append(`<article class="container">
        <p id="ArticleParagraph" class="mt-3">This is Article paragraph</p>
        </article>`)

    }

    function AjaxRequest(method,url,callback){
        let XHR =  new XMLHttpRequest();
        XHR.addEventListener(("readystatechange"),()=>{
            if(XHR.readyState === 4 && XHR.status ===200)
            {
                if(typeof callback === "function"){
                    callback(XHR.responseText);

                }else {
                    console.log("Error: callback not a function");
                }
            }
        });
        XHR.open(method,url);
        XHR.send();

    }

    function LoadHeader(html_data)
    {
        $("header").html(html_data);
        $(`li>a:contains(${document.title})`).addClass("active");
        CheckLogin();
    }


    function DisplayProductsPage(){
        console.log("Display Products Page called");

    }

    function DisplayServicesPage(){
        console.log("Display Services Page called");

    }

    function DisplayAboutUsPage(){
        console.log("Display About Page called");

    }

    function DisplayRegisterPage(){
        console.log("Display Register Page called");

        $("#submitButton").on("click",(event)=>{
            event.preventDefault();
        });
    }

    function DisplayLoginPage(){
        console.log("Display Login Page called");

        let messageArea= $("#messageArea");
        messageArea.hide();
        $("#loginButton").on("click",function (){

            let success = false;
            let newUser = new core.User();
            $.get("./data/user.json",function (data){
                for(const user of data.users){
                    if(username.value === user.Username && password.value === user.Password){
                        newUser.fromJSON(user);
                        success=true;
                        break;
                    }
                }

                if(success){
                    sessionStorage.setItem("user",newUser.serialize());
                    messageArea.removeAttr("class").hide();
                    location.href="contact-list.html";
                }else {
                    $("#username").trigger("focus").trigger("select");
                    messageArea.addClass("alert alert-danger").text("user is not exists").show();

                }
            });
        });
        $("#cancelButton").on("click",function (){
            document.forms[0].reset();
            location.href ="index.html";
        });


    }

    function CheckLogin(){
        if(sessionStorage.getItem("user")) {

            $("#login").html(`<a id="logout" class="nav-link" href="#"><i class="fas fa-sign-out-alt "></i>Logout</a>`)
        }
        $("#logout").on("click",function () {
            sessionStorage.clear();
            location.href = "index.html";

        });
    }



    function ValidateField(input_field_id, regular_expression, error_message){
        let messageArea = $("#messageArea");

        $(input_field_id).on("blur", function(){

            let inputFieldText = $(this).val();

            if(!regular_expression.test(inputFieldText)){
                //fail validation
                $(this).trigger("focus").trigger("select");
                messageArea.addClass("alert alert-danger").text(error_message).show();
            }
            else{
                //pass validation
                messageArea.removeAttr("class").hide();

            }



        });

    }

    function ContactFormValidation(){
        ValidateField("#fullName", /^([A-Z][a-z]{1,3}\.?\s)?([A-Z][a-z]+)+([\s,-]([A-z][a-z]+))*$/, "Please enter a valid firstname and last name (ex Mr. Peter Parker)");
        ValidateField("#contactNumber", /^(\+\d{1,3}[\s-.])?\(?\d{3}\)?[\s-.]?\d{3}[\s-.]\d{4}$/, "Please enter a valid contact number (ex 555-555-4567");

        ValidateField("#emailAddress", /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,10}$/, "Please enter a valid email address (ex peter.parker@isp.com)");
    }
    function DisplayContactUsPage(){
        console.log("Display Contact Page called");

        ContactFormValidation();



        let sendButton = document.getElementById("sendButton");
        let subscribeCheckbox = document.getElementById("subscribeCheckbox");

        sendButton.addEventListener("click", function (event ){
            if(subscribeCheckbox.checked){
                AddContact(fullName.value,contactNumber.value,emailAddress.value);
                location.href="contact-list.html";

                }
        });

    }

    function DisplayContactListPage() {
        console.log("Display Contact List Page called");

        if (localStorage.length > 0) {
            let contactList = document.getElementById("contactList");
            let data = "";

            let keys = Object.keys(localStorage);
            let index = 1;
            for (const key of keys) {

                let contactData = localStorage.getItem(key);
                let contact = new core.Contact();
                contact.deserialize(contactData);
                data += `
                <tr>
                    <th scope="row" class="text-center">${index}</th>
                    <td>${contact.FullName}</td>
                    <td>${contact.ContactNumber}</td>
                    <td>${contact.EmailAddress}</td>
                    <td class="text-center">
                        <button value="${key}" class="btn btn-primary btn-sm edit">                          
                            <i class="fas fa-edit fa-sm"> Edit</i>
                        </button>           
                    </td>
                    <td class="text-center">
                        <button value="${key}" class="btn btn-danger btn-sm delete">                          
                            <i class="fas fa-trash-alt fa-sm"> Delete</i>
                        </button>           
                    </td>
                  
                    <td></td>
                </tr>`;
                index++;
            }
            contactList.innerHTML = data;
        }
        $("button.delete").on("click", function () {
            if (confirm("Delete contact ,are you sure?")) {
                localStorage.removeItem($(this).val());
            }
            location.href = "contact-list.html";
        });
        $("button.edit").on("click", function () {
            location.href = "edit.html#" + $(this).val();
        });

        $("#addButton").on("click", (event) => {
            event.preventDefault();
            console.log("add c");
            location.href = "edit.html#add";
        });
    }

        function DisplayEditPage() {
            console.log("Edit Contact Page ");

            ContactFormValidation();

            let page = location.hash.substring(1);
            switch (page) {
                case "add":
                    $("main>h1").text("Add Contact");
                    $("#editButton").html(`<i class="fas fa-plus-circle fa-sm"> Add</i>`);
                    $("#editButton").on("click", (event) => {
                        event.preventDefault()
                        AddContact(fullName.value, contactNumber.value, emailAddress.value);
                        location.href = "contact-list.html";
                    });
                    $("#cancelButton").on("click", () => {
                        location.href = "contact-list.html";
                    });
                    break;
                default: {
                    let contact = new core.Contact();
                    contact.deserialize(localStorage.getItem(page));
                    $("#fullName").val(contact.FullName);
                    $("#contactNumber").val(contact.ContactNumber);
                    $("#emailAddress").val(contact.EmailAddress);
                    $("#editButton").on("click", (event) => {
                        event.preventDefault();
                        contact.FullName = $("#fullName").val();
                        contact.ContactNumber = $("#contactNumber").val();
                        contact.EmailAddress = $("#emailAddress").val();
                        localStorage.setItem(page, contact.serialize());
                        location.href = "contact-list.html";
                    });
                    $("#cancelButton").on("click", () => {
                        location.href = "contact-list.html";
                    });
                }
                    break;
            }
        }




    function Start()
    {
        console.log("Application Started!");
        AjaxRequest("GET","header.html",LoadHeader);
        switch(document.title)
        {
            case "Home":
                DisplayHomePage();
                break;
            case "Our Products":
                DisplayProductsPage();
                break;
            case "About Us":
                DisplayAboutUsPage();
                break;
            case "Our Services":
                DisplayServicesPage();
                break;
            case "Contact":
                DisplayContactUsPage();
                break;
            case "Contact List":
                DisplayContactListPage();
                break;
            case "Edit Contact":
                DisplayEditPage();
            case "Register":
                DisplayRegisterPage();
            case "Login":
                DisplayLoginPage();
        }



    }
    window.addEventListener("load", Start)
})();




