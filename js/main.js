// add contact button (navbar)
var addNewContact = document.getElementById("addNewContact");
// pop modal vars
var popModal = document.querySelector('.pop');
var popModalInner = document.querySelector('.pop-inner');
var popCloseIcon = document.querySelector('.close');
var cancelButton = document.querySelector('.cancel');
var formTitle = document.getElementById("formTitle");
// form inputs
var profileImage = document.getElementById('profileImage')
var fullName = document.getElementById('fullName')
var phoneNumber = document.getElementById('phoneNumber')
var email = document.getElementById('email')
var address = document.getElementById('address')
var group = document.getElementById('group')
var notes = document.getElementById('notes')
var favoriteInput = document.getElementById('favoriteInput')
var emergencyInput = document.getElementById('emergencyInput')
var addConatctButton = document.getElementById('addConatctButton')
var editConatctButton = document.getElementById('editConatctButton')
// contacts number
var contactsNum = document.getElementById('contactsNum')
// cards number vars
var contactNum = document.getElementById('contactNum')
var favNum = document.getElementById('favNum')
var emgNum = document.getElementById('emgNum')
// containers
var favShow = document.getElementById('favShow')
var emgShow = document.getElementById('emgShow')
var contactsShow = document.getElementById('contactsShow')

var favEmpty = document.getElementById('favEmpty')
var emgEmpty = document.getElementById('emgEmpty')
var contactsEmpty = document.getElementById('contactsEmpty')
var search = document.getElementById('searchInput')


var editIndex; //contacts edit index


var contactsList = [];

if (localStorage.getItem("contacts") !== null) {
    contactsList = JSON.parse(localStorage.getItem("contacts"));
    displayContacts();
}

popCloseIcon.addEventListener("click", showPop)
cancelButton.addEventListener("click", showPop)
addNewContact.addEventListener("click", function () {
    showPop()
    formTitle.innerText = "Add New Contact"
    addConatctButton.classList.remove("d-none")
    editConatctButton.classList.add("d-none")
})
fullName.addEventListener("input", validateName)
phoneNumber.addEventListener("input", validatePhone)
email.addEventListener("input", validateEmail)
addConatctButton.addEventListener("click", addContact)
editConatctButton.addEventListener("click", saveContact)

document.addEventListener("click", function (e) {
    if (e.target === popModal || e.target === popModalInner) {
        showPop();
    }
})

search.addEventListener("input", searchContact)





function showPop() {
    if (popModal.classList.contains("d-none")) {
        popModal.classList.remove("d-none")
    } else {
        popModal.classList.add("d-none")
    }
    clearInputs()
}

function validateName() {
    var pattern = /^[a-zA-Z\u0600-\u06FF\s]{2,50}$/;


    if (pattern.test(fullName.value) && fullName.value !== "") {
        document.getElementById("nameErorr").classList.add("d-none")
        fullName.classList.remove("shadow-none")
        fullName.classList.remove('border-danger');
    } else {
        fullName.classList.add('border-danger');
        document.getElementById("nameErorr").classList.remove("d-none")
        fullName.classList.add("shadow-none")
    }

    return pattern.test(fullName.value) && fullName.value !== "";
}

function validatePhone() {
    var pattern = /^01[0125][0-9]{8}$/;

    if (pattern.test(phoneNumber.value) && phoneNumber.value != "") {
        document.getElementById("phoneErorr").classList.add("d-none")
        phoneNumber.classList.remove("shadow-none")
        phoneNumber.classList.remove('border-danger');
    } else {
        phoneNumber.classList.add('border-danger');
        document.getElementById("phoneErorr").classList.remove("d-none")
        phoneNumber.classList.add("shadow-none")
    }


    return pattern.test(phoneNumber.value) && phoneNumber.value != "";
}

function validateEmail() {
    var pattern = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

    if (pattern.test(email.value) || email.value == "") {
        document.getElementById("emailErorr").classList.add("d-none")
        email.classList.remove("shadow-none")
        email.classList.remove('border-danger');
    } else {
        email.classList.add('border-danger');
        document.getElementById("emailErorr").classList.remove("d-none")
        email.classList.add("shadow-none")
    }

    return pattern.test(email.value) || email.value == "";
}

function addContact() {
    if (!validateName()) {
        Swal.fire({
            title: "Invalid Name",
            text: "Name should contain only letters and spaces (2-50 characters)",
            icon: "error"
        });
    } else if (!validatePhone()) {
        Swal.fire({
            title: "Invalid Phone",
            text: "Please enter a valid Egyptian phone number (e.g., 01012345678 or +201012345678)",
            icon: "error"
        });
    } else if (!validateEmail()) {
        Swal.fire({
            title: "Invalid Email",
            text: "Please enter a valid email address",
            icon: "error"
        });
    } else {
        const exist = contactsList.find(c => c.phone === phoneNumber.value);
        if (exist) {
            Swal.fire({
                title: "Duplicate Phone Number",
                text: `A contact with this phone number already exists:${exist.name.split(" ")[0]}`,
                icon: "error"
            });
            return;
        }

        contact = {
            profileImage: profileImage.files[0] ? profileImage.files[0].name : '',
            name: fullName.value,
            phone: phoneNumber.value,
            email: email.value,
            address: address.value,
            group: group.value,
            notes: notes.value,
            favorite: favoriteInput.checked,
            emergency: emergencyInput.checked
        }
        contactsList.push(contact);
        localStorage.setItem("contacts", JSON.stringify(contactsList));

        clearInputs()
        displayContacts()
        showPop()
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Add!",
            text: "Contact has been add successfully.",
            showConfirmButton: false,
            timer: 1500
        });
    }


}

function clearInputs() {
    profileImage.files[0] = null;
    fullName.value = ""
    phoneNumber.value = ""
    email.value = ""
    address.value = ""
    group.value = ""
    notes.value = ""
    favoriteInput.checked = false
    emergencyInput.checked = false
}

function displayContacts() {
    contactsShow.innerHTML = "";
    favShow.innerHTML = "";
    emgShow.innerHTML = "";
    var fav = contactsList.filter(c => c.favorite)
    var emg = contactsList.filter(c => c.emergency)
    contactsNum.innerHTML = contactsList.length;
    contactNum.innerHTML = contactsList.length;
    favNum.innerHTML = fav.length
    emgNum.innerHTML = emg.length

    var favBox = ""
    var emgBox = ""
    var contactBox = ""

    if(fav.length > 0){
        favEmpty.classList.add('d-none');
        for (var i = 0; i < fav.length; i++) {
            favBox += `
                <div class="col">
                    <div class="inner transtion">
                        <div class="fav cursor-pointer d-flex align-items-center gap-2 p-2 shadow-sm border border-opacity-10 border-secondary rounded-3">
                            <div class="icon flex-center rounded-3 text-white">
                            ${fav[i].profileImage ? `<img src="images/${fav[i].profileImage}" alt="" class="w-100 rounded-3">` : `<span class="text-uppercase fw-bold">${splitName(fav[i].name)}</span>`}
                            </div>
                            <div class="fw-medium flex-grow-1">
                                <p class="m-0">${fav[i].name}</p>
                                <p class="m-0 fs-8 text-secondary">${fav[i].phone}</p>
                            </div>
                            <a href="tel:${fav[i].phone}" class="call-icon rounded-3 text-success transtion flex-center">
                                <i class="fa-solid fa-phone fs-7"></i>
                            </a>
                        </div>
                    </div>
                </div>
            `
        }
        favShow.innerHTML = favBox;
        
    }else{
        favEmpty.classList.remove('d-none');
    }
    
    if(emg.length > 0){
        emgEmpty.classList.add('d-none');
        for (var i = 0; i < emg.length; i++) {
            emgBox += `
                <div class="col">
                    <div class="inner transtion">
                        <div class="emg cursor-pointer d-flex align-items-center gap-2 p-2 shadow-sm border border-opacity-10 border-secondary rounded-3">
                        <div class="icon flex-center rounded-3 text-white">
                            ${emg[i].profileImage ? `<img src="images/${emg[i].profileImage}" alt="" class="w-100 rounded-3">` : `<span class="text-uppercase fw-bold">${splitName(emg[i].name)}</span>`}
                        </div>
                        <div class="fw-medium flex-grow-1">
                            <p class="m-0">${emg[i].name}</p>
                            <p class="m-0 fs-8 text-secondary">${emg[i].phone}</p>
                        </div>
                        <a href="tel:${emg[i].phone}" class="call-icon rounded-3 text-danger transtion flex-center">
                            <i class="fa-solid fa-phone fs-7"></i>
                        </a>
                    </div>
                    </div>
                </div>
            `
        }
        emgShow.innerHTML = emgBox;
    }else{
        emgEmpty.classList.remove('d-none');
    }

    if(contactsList.length > 0){
        contactsEmpty.classList.add('d-none')
        for(var i = 0; i < contactsList.length; i++){
            contactBox += `
                <div
                    class="contact h-100 d-flex flex-column shadow-sm bg-white border border-opacity-10 border-secondary rounded-4 overflow-hidden">
                    <div class="flex-grow-1 p-3">
                        <div class="d-flex gap-3 mb-3">
                            <div class="contact-icon rounded-3 flex-center position-relative">
                                ${contactsList[i].profileImage ? `<img src="images/${contactsList[i].profileImage}" alt="" class="w-100 rounded-3">` : `<p class="m-0 text-uppercase fs-4 fw-bold text-white">${splitName(contactsList[i].name)}</p>`}
                                <div
                                    class=" ${contactsList[i].favorite ? "" : "d-none"} h-26 w-26 border border-white border-3 flex-center position-absolute start-100 top-0 translate-middle text-white bg-warning rounded-circle">
                                    <i class="fa-solid fa-star fs-9"></i>
                                </div>
                                <div
                                    class=" ${contactsList[i].emergency ? "" : "d-none"} h-26 w-26 border border-white border-3 flex-center position-absolute start-100 top-100 translate-middle text-white bg-danger rounded-circle">
                                    <i class="fa-solid fa-heart-pulse fs-9"></i>
                                </div>
                            </div>
                            <div>
                                <p class="text-uppercase fw-bold fs-7">${contactsList[i].name}</p>
                                <div class="d-flex align-items-center gap-2">
                                    <div
                                        class="icon w-26 h-26 flex-center rounded-2 bg-primary bg-opacity-10 text-primary">
                                        <i class="fa-solid fa-phone fs-9"></i>
                                    </div>
                                    <p class="m-0 text-secondary fs-7 fw-medium">${contactsList[i].phone}</p>
                                </div>
                            </div>
                        </div>
                        <div class="${contactsList[i].email ? "d-flex" : "d-none"} align-items-center gap-2">
                            <div class="icon w-26 h-26 flex-center rounded-2 bg-light-purple text-purple">
                                <i class="fa-solid fa-envelope fs-9"></i>
                            </div>
                            <p class="m-0 text-secondary fs-7 fw-medium">${contactsList[i].email}</p>
                        </div>
                        <div class="${contactsList[i].address ? "d-flex" : "d-none"} align-items-center gap-2 my-2">
                            <div
                                class="icon w-26 h-26 flex-center rounded-2 bg-success bg-opacity-10 text-success">
                                <i class="fa-solid fa-location-dot fs-9"></i>
                            </div>
                            <p class="m-0 text-secondary fs-7 fw-medium">${contactsList[i].address}</p>
                        </div>
                        <div class="d-flex align-items-center gap-2">
                            <p class="${contactsList[i].group} ${contactsList[i].group ? "" : "d-none"}  px-2 rounded-2 fs-8 py-1 fw-medium m-0 text-capitalize">${contactsList[i].group}</p>
                            <p class="${contactsList[i].emergency ? "" : "d-none"} m-0 fs-8 py-1 bg-danger bg-opacity-10 fw-medium rounded-2 text-danger px-2"><i class="fa-solid fa-heart-pulse"></i> Emergency</p>
                        </div>
                    </div>
                    <div
                        class="py-2 px-4 bg-light-gray border-top border-opacity-10 border-secondary d-flex align-items-center justify-content-between">
                        <div class="d-flex align-items-center gap-3">
                            <a href="tel:${contactsList[i].phone}" class="call flex-center rounded-3">
                                <i class="fa-solid fa-phone fs-7 text-success"></i>
                            </a>
                            <a href="mailto:${contactsList[i].email}" class="${contactsList[i].email ? "" : "d-none"} mail flex-center rounded-3 bg-light-purple">
                                <i class="fa-solid fa-envelope fs-7 text-purple"></i>
                            </a>
                        </div>
                        <div class="d-flex align-items-center gap-2 text-secondary fs-7">
                            <div onclick="favToggle(${i})" class="favorite flex-center rounded-3 ${contactsList[i].favorite ? "active" : ""}">
                                <i class="${contactsList[i].favorite ? "fa-solid" : "fa-regular"} fa-star"></i>
                            </div>
                            <div onclick="emgToggle(${i})" class="emergency flex-center rounded-3 ${contactsList[i].emergency ? "active" : ""}">
                                <i class="${contactsList[i].emergency ? "fa-solid fa-heart-pulse" : "fa-regular fa-heart"}"></i>
                            </div>
                            <div onclick="editContact(${i})" class="edit flex-center rounded-3">
                                <i class="fa-solid fa-pen"></i>
                            </div>
                            <div onclick="deleteContact(${i})" class="delete flex-center rounded-3">
                                <i class="fa-solid fa-trash"></i>
                            </div>
                        </div>
                    </div>
                </div>
            `
        }
        contactsShow.innerHTML = contactBox;
    }else{
        contactsEmpty.classList.remove("d-none")
    }
}

function splitName(name){
    nameList = name.split(" ")
    if(nameList.length > 0){
        return nameList[0][0] + nameList[nameList.length - 1][0];
    }
    return nameList[0][0];
}

function favToggle(index){
    if(contactsList[index].favorite){
        contactsList[index].favorite = false
    }else{
        contactsList[index].favorite = true
    }
    displayContacts()
    localStorage.setItem("contacts", JSON.stringify(contactsList));
}

function emgToggle(index){
    if(contactsList[index].emergency){
        contactsList[index].emergency = false
    }else{
        contactsList[index].emergency = true
    }
    displayContacts()
    localStorage.setItem("contacts", JSON.stringify(contactsList));
}

function deleteContact(index){
    Swal.fire({
        title: "Delete Contact?",
        text: `Are you sure you want to delete ${contactsList[index].name.split(" ")[0]}? This action cannot be undone.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DC2626",
        cancelButtonColor: "#6B7280",
        confirmButtonText: "Yes, delete it!"
        }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Deleted!",
                text: "Contact has been deleted.",
                showConfirmButton: false,
                timer: 1500
            });
            contactsList.splice(index , 1);
            localStorage.setItem("contacts", JSON.stringify(contactsList));
            displayContacts();
        }
    });
}

function editContact(index){
    showPop()
    formTitle.innerText = "Edit Contact"
    fullName.value = contactsList[index].name
    phoneNumber.value = contactsList[index].phone
    email.value = contactsList[index].email
    address.value = contactsList[index].address
    group.value = contactsList[index].group
    notes.value = contactsList[index].notes
    favoriteInput.checked = contactsList[index].favorite
    emergencyInput.checked = contactsList[index].emergency

    addConatctButton.classList.add("d-none")
    editConatctButton.classList.remove("d-none")

    editIndex = index
}

function saveContact() {

    if (!validateName()) {
        Swal.fire({
            title: "Invalid Name",
            text: "Name should contain only letters and spaces (2-50 characters)",
            icon: "error"
        });
        return;
    }

    if (!validatePhone()) {
        Swal.fire({
            title: "Invalid Phone",
            text: "Please enter a valid Egyptian phone number",
            icon: "error"
        });
        return;
    }

    if (!validateEmail()) {
        Swal.fire({
            title: "Invalid Email",
            text: "Please enter a valid email address",
            icon: "error"
        });
        return;
    }

    const exist = contactsList.find((c, i) => c.phone === phoneNumber.value && i !== editIndex);
    if (exist) {
        Swal.fire({
            title: "Duplicate Phone Number",
            text: `This number belongs to: ${exist.name.split(" ")[0]}`,
            icon: "error"
        });
        return;
    }

    const updatedContact = {
        profileImage: profileImage.files[0] ? profileImage.files[0].name : contactsList[editIndex].profileImage,
        name: fullName.value,
        phone: phoneNumber.value,
        email: email.value,
        address: address.value,
        group: group.value,
        notes: notes.value,
        favorite: favoriteInput.checked,
        emergency: emergencyInput.checked
    }

    contactsList.splice(editIndex, 1, updatedContact);
    localStorage.setItem("contacts", JSON.stringify(contactsList));

    clearInputs()
    displayContacts()
    showPop()
    Swal.fire({
        position: "center",
        icon: "success",
        title: "Edited!",
        text: "Contact has been edited successfully.",
        showConfirmButton: false,
        timer: 1500
    });
}


function searchContact() {
    contactsShow.innerHTML = "";
    let box = "";
    let searchValue = search.value.trim().toLowerCase();

    for (let i = 0; i < contactsList.length; i++) {

        let name = contactsList[i].name.toLowerCase();
        let phone = contactsList[i].phone.toLowerCase();
        let email = contactsList[i].email.toLowerCase();

        if (name.includes(searchValue) || phone.includes(searchValue) || email.includes(searchValue)
        ) {
            box += `
                <div
                    class="contact h-100 d-flex flex-column shadow-sm bg-white border border-opacity-10 border-secondary rounded-4 overflow-hidden">
                    <div class="flex-grow-1 p-3">
                        <div class="d-flex gap-3 mb-3">
                            <div class="contact-icon rounded-3 flex-center position-relative">
                                ${contactsList[i].profileImage ? `<img src="images/${contactsList[i].profileImage}" alt="" class="w-100 rounded-3">` : `<p class="m-0 text-uppercase fs-4 fw-bold text-white">${splitName(contactsList[i].name)}</p>`}
                                <div class="${contactsList[i].favorite ? "" : "d-none"} h-26 w-26 border border-white border-3 flex-center position-absolute start-100 top-0 translate-middle text-white bg-warning rounded-circle">
                                    <i class="fa-solid fa-star fs-9"></i>
                                </div>
                                <div class="${contactsList[i].emergency ? "" : "d-none"} h-26 w-26 border border-white border-3 flex-center position-absolute start-100 top-100 translate-middle text-white bg-danger rounded-circle">
                                    <i class="fa-solid fa-heart-pulse fs-9"></i>
                                </div>
                            </div>
                            <div>
                                <p class="text-uppercase fw-bold fs-7">${contactsList[i].name}</p>
                                <div class="d-flex align-items-center gap-2">
                                    <div class="icon w-26 h-26 flex-center rounded-2 bg-primary bg-opacity-10 text-primary">
                                        <i class="fa-solid fa-phone fs-9"></i>
                                    </div>
                                    <p class="m-0 text-secondary fs-7 fw-medium">${contactsList[i].phone}</p>
                                </div>
                            </div>
                        </div>
                        <div class="${contactsList[i].email ? "d-flex" : "d-none"} align-items-center gap-2">
                            <div class="icon w-26 h-26 flex-center rounded-2 bg-light-purple text-purple">
                                <i class="fa-solid fa-envelope fs-9"></i>
                            </div>
                            <p class="m-0 text-secondary fs-7 fw-medium">${contactsList[i].email}</p>
                        </div>
                        <div class="${contactsList[i].address ? "d-flex" : "d-none"} align-items-center gap-2 my-2">
                            <div class="icon w-26 h-26 flex-center rounded-2 bg-success bg-opacity-10 text-success">
                                <i class="fa-solid fa-location-dot fs-9"></i>
                            </div>
                            <p class="m-0 text-secondary fs-7 fw-medium">${contactsList[i].address}</p>
                        </div>
                        <div class="d-flex align-items-center gap-2">
                            <p class="${contactsList[i].group} ${contactsList[i].group ? "" : "d-none"} px-2 rounded-2 fs-8 py-1 fw-medium m-0 text-capitalize">${contactsList[i].group}</p>
                            <p class="${contactsList[i].emergency ? "" : "d-none"} m-0 fs-8 py-1 bg-danger bg-opacity-10 fw-medium rounded-2 text-danger px-2">
                                <i class="fa-solid fa-heart-pulse"></i> Emergency
                            </p>
                        </div>
                    </div>
                    <div class="py-2 px-4 bg-light-gray border-top border-opacity-10 border-secondary d-flex align-items-center justify-content-between">
                        <div class="d-flex align-items-center gap-3">
                            <a href="tel:${contactsList[i].phone}" class="call flex-center rounded-3">
                                <i class="fa-solid fa-phone fs-7 text-success"></i>
                            </a>
                            <a href="mailto:${contactsList[i].email}" class="${contactsList[i].email ? "" : "d-none"} mail flex-center rounded-3 bg-light-purple">
                                <i class="fa-solid fa-envelope fs-7 text-purple"></i>
                            </a>
                        </div>
                        <div class="d-flex align-items-center gap-2 text-secondary fs-7">
                            <div onclick="favToggle(${i})" class="favorite flex-center rounded-3 ${contactsList[i].favorite ? "active" : ""}">
                                <i class="${contactsList[i].favorite ? "fa-solid" : "fa-regular"} fa-star"></i>
                            </div>
                            <div onclick="emgToggle(${i})" class="emergency flex-center rounded-3 ${contactsList[i].emergency ? "active" : ""}">
                                <i class="${contactsList[i].emergency ? "fa-solid fa-heart-pulse" : "fa-regular fa-heart"}"></i>
                            </div>
                            <div onclick="editContact(${i})" class="edit flex-center rounded-3">
                                <i class="fa-solid fa-pen"></i>
                            </div>
                            <div onclick="deleteContact(${i})" class="delete flex-center rounded-3">
                                <i class="fa-solid fa-trash"></i>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    if (box) {
        contactsEmpty.classList.add("d-none");
        contactsShow.innerHTML = box;
    } else {
        contactsEmpty.classList.remove("d-none");
        contactsShow.innerHTML = "";
    }
}




