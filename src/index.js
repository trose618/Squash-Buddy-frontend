const usersURL = 'http://localhost:3000/api/v1/users'
const navbar = document.querySelector('.topnav')
const signUpDivs = Array.from(navbar.getElementsByClassName("signin"))
const signedInDivs = Array.from(navbar.getElementsByClassName("signedin"))
const signInForm = document.querySelector('.signin-field')
const newUserForm = document.querySelector('.newUser-form')
const userIdField = document.querySelector('.user-id-field')
const displayPanel = document.getElementById('page-panel')//holds info displayed to users
let currentUser = {}
let currentChatPartner = { name: "", id: "" }


document.addEventListener("DOMContentLoaded", () => {

    hideSignedInDivs()
    navbar.addEventListener('click', (event) => {

        if (event.target.id === "sign-in-div") {
            hideNewUserForm()
            clearDisplayPanel()
            renderSignInForm()
        }
        else if (event.target.id === "new-user-div") {
            clearDisplayPanel()
            newUserForm.style.display = "block"
        }
        else if (event.target.id === "sign-out-div") {
            logout()

        }
        else if (event.target.id === "teams-div") {
            clearDisplayPanel()
            displayTeams()
        }
        else if (event.target.id === "profile-div") {
            clearDisplayPanel()
            displayProfile()
        }
        else if (event.target.id === "find-players-div") {
            clearDisplayPanel()
            displayPlayersDiv()
        }
        else if (event.target.id === "messages-div") {
            renderConvoSideBar()
            if (currentChatPartner.name !== "") {
                createChatWindow(currentChatPartner.name, currentChatPartner.id)
            }
        }


    })
    document.addEventListener('dblclick', function (event) {
        if (event.target.id === "delete-btn") {

            fetch(`http://localhost:3000/api/v1/users/${currentUser.id}`, {
                method: 'delete'
            })
                .then(() => {
                    logout()
                    alert("Your account has successfully been deleted.")
                })
        }
    })
    document.addEventListener('submit', function (event) {
        event.preventDefault()
        //debugger
        if (event.target.className === "signin-field") {
            //do fetch and set user-id-field.id to this id
            let input = event.target.querySelector('#signin-input').value


            fetch(`http://localhost:3000/api/v1/users/${input}`)
                .then(handleErrors)
                .then(res => res.json())
                .then(data => {

                    currentUser = data
                    showSignedInDivs();
                    userIdField.id = input;
                    clearDisplayPanel()
                    displayProfile(data);

                }).catch(function (error) {
                    console.log(error)
                })

        }
        if (event.target.className.includes("newUser-form")) {
            //do fetch and set user-id-field.id to this id


            let name = newUserForm.querySelector('#new-name').value
            let level = newUserForm.querySelector('#new-level').value
            let city = newUserForm.querySelector('#new-city').value
            let zipcode = newUserForm.querySelector('#new-zipcode').value
            let imageurl = newUserForm.querySelector('#new-imageurl').value

            newUserForm.reset()

            if (!name || !level || !city || !zipcode) {
                alert('Cannot submit empty fields.')
            } else {

                fetch(usersURL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                        name: name,
                        level: level,
                        city: city,
                        zipcode: zipcode,
                        imageurl: imageurl
                    })
                })
                    .then(res => res.json())
                    .then(userInfo => {
                        //sign in the new user
                        currentUser = userInfo
                        showSignedInDivs()
                        userIdField.id = userInfo.id
                        clearDisplayPanel()
                        displayProfile()
                    })
            }
        }
        if (event.target.className.includes("player-search-form")) {

            let nearMe = document.getElementById('near-me').checked
            let byName = document.getElementById('by-name').checked
            let byLevel = document.getElementById('by-level').checked

            if (nearMe === false && byName === false && byLevel === false) {
                clearDisplayPanel()
                displayPlayersDiv()
                let selectCriteria = document.createElement('p')
                selectCriteria.innerText = "Please select at least one of the search criteria."
                displayPanel.append(selectCriteria)
            }
            else {

                let nameInput = document.getElementById('name-input').value
                let level = parseFloat(document.getElementById('myList').value)

                fetch(usersURL)
                    .then(res => res.json())
                    .then(data => displayPlayers(nearMe, byName, byLevel, nameInput, level, data))
            }
        }
        if (event.target.id === "edit-form") {
            let editName = document.getElementById('edit-name').value
            let editLevel = document.getElementById('edit-level').value
            let editCity = document.getElementById('edit-city').value
            let editZipcode = document.getElementById('edit-zipcode').value
            let editImage = document.getElementById('edit-imageurl').value

            fetch(`http://localhost:3000/api/v1/users/${currentUser.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    name: editName,
                    level: editLevel,
                    city: editCity,
                    zipcode: editZipcode,
                    imageurl: editImage
                })
            })
                .then(res => res.json())
                .then(data => {
                    currentUser = data
                    clearDisplayPanel()
                    displayProfile()
                })
        }
        if (event.target.className === "new-team-form") {
            teamName = document.getElementById('new-team-name-input').value


            //creating the team
            fetch('http://localhost:3000/api/v1/teams', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    name: teamName
                })
            })
                .then(res => res.json())
                .then(data => () => {

                    let newTeamId = data.id
                    fetch(`http://localhost:3000/api/v1/user_teams/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                        body: JSON.stringify({
                            user_id: currentUser.id,
                            team_id: newTeamId
                        })
                    })
                        .then(res => res.json())
                        .then(data => {
                            clearDisplayPanel()
                            displayTeams()
                        })
                })

            //creating player association with team

        }

    })//end of submit event listener

    displayPanel.addEventListener('click', (event) => {
        if (event.target.id === "create-team-btn") {
            renderNewTeamForm()
        }
        else if (event.target.id === "find-team-btn") {
            renderTeamSearchForm()
        }
        else if (event.target.id === "edit-btn") {
            clearDisplayPanel()
            renderEditForm()
        }
        else if (event.target.className.includes("send-btn")) {

            let recieverID = document.querySelector('.comments').dataset.id
            let content = document.getElementById('the-message')

            fetch('http://localhost:3000/api/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    sender_id: currentUser.id,
                    reciever_id: recieverID,
                    message_content: content.value
                })

            })
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    let msgHTML = new Message(data.sender.name, data.message_content, data.created_at)
                    let div = document.createElement('div')
                    div.className = "comment"
                    div.innerHTML = msgHTML.html()
                    document.querySelector('.messages').append(div)
                    document.querySelector('.messages').scrollTop = document.querySelector('.messages').scrollHeight;
                    content.value = ""
                })
        }
        else if (event.target.innerText === "Message") {

            renderConvoSideBar()
            createChatWindow(event.target.id, event.target.parentElement.id)



        }
    })

})

function hideSignedInDivs() {
    signedInDivs.forEach(function (div) {
        div.style.display = 'none'
    })
}

function hideNewUserForm() {
    newUserForm.style.display = 'none'
}

function showSignedInDivs() {

    hideNewUserForm()
    document.getElementById("sign-in-div").style.display = "none"
    document.getElementById("new-user-div").style.display = "none"
    signedInDivs.forEach(function (div) {
        div.style.display = 'inline'
    })
}


function displayProfile() {
    let userDiv = document.createElement('div')
    let userProfileTitle = document.createElement('h1')
    let userImage = document.createElement('img')
    let userLevel = document.createElement('h3')
    let userCity = document.createElement('h3')
    let userZipCode = document.createElement('h3')
    let editButton = document.createElement('button')
    let deleteButton = document.createElement('button')
    userDiv.className = "ui raised segment"
    userDiv.style = "width:50%;background-color:#777"
    if (currentUser.imageurl === null) {
        userImage.src = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAH8AfwMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAAAwYBBAUHAv/EADUQAAICAQEDBwsEAwAAAAAAAAABAgMEEQUGIRIxQVFxobETIiMyM1JhcoHB4TVzkdEUQkP/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A9xAAAAAAAAAAAGNTIAAAAAAAAAAAAAAIMzLpw6vKXz5K6F0vsPvIuhj0ztsekILVspG0M23OyXbY9F/rHoiuoDfzd4cm5tY3oYdemsmcyeVkWPWzItk/jNkRgCevMyanrXkXR7Js62BvFdW1HMj5SHvxWkl9Ok4RkD0DHvryKo2UzU4PmaJClbI2jPAyE226JPz4/cukZKUVKLTTWqaAyAAAAAAAAAAODvXkONNOPF+u3KXYvyVg7e9Tf+fUnzeRXizigYAAAAAC37tZDu2coSerqlyPp0FQLHui3plLo1h9wLEAAAAAAAAAAK5vZS9aL1zcYPxX3K6X3aGLHMxZ0S4cpcH1PoZRr6Z0WzqtjyZxejQEYAAAAAWvdalwwZ2v/rPh2Lh/ZXMHFszciNNXO3xfUusvNFUKKYVVrSMFokBIAAAAAAAAAABz9q7Lqz4cpvkXR9WaXczoACiZmz8nDfpqnyffjxi/qay4l/syKIJq22uPwlJI0LZbFm9bJYbfbECnm7g7Ly8xrkVuFfTZNaL8lkps2PW9ap4cX16x1N+u+qz2dkJfLJMCDZ2z6cCrkVcZP1pvnkbYAAAAAAAAAAhysqjFrdmRYoR+PT2EW086GBju2fGT4Rj1spmXlXZdztvlrJ8y6EupAdjM3ksk3HErUI+/Pi/4OTfnZWQ/TZFkvhrov4NYADJgADK4PVcH8DAA26No5mO/RZE0upvVd518LeTio5tei9+v+iugD0Gi6u+tWUzU4PmaJCibPzrsC5TqesX60G+Ei6YeTXl48LqnrGS+qfUBOAAAAApu8OU8jaM4p+ZV5kV49/gcwlyXysm5vndkn3siAAAAAAAAAAAAdvdbKdeVLGk/NsWse1fg4hvbGem1cVr39O5gXcAAAAB59f7e355eJGSX+3t+eXiRgAAAAAAAAAAAN3Y/6pi/uGkbux/1TF/cAvAAA//Z"
    } else {
        userImage.src = `${currentUser.imageurl}`
    }
    userImage.style = "width:50%;height:50%;"
    editButton.innerText = "Edit Profile"
    editButton.id = "edit-btn"
    deleteButton.id = "delete-btn"
    deleteButton.innerText = "Double Click To Delete Profile"

    userProfileTitle.innerText = `Welcome, ${currentUser.name}`
    userLevel.innerText = `Level: ${currentUser.level}`
    userCity.innerText = `City: ${currentUser.city}`
    userZipCode.innerText = `Zipcode: ${currentUser.zipcode}`

    userDiv.append(userProfileTitle)
    userDiv.append(userImage)
    userDiv.append(userLevel)
    userDiv.append(userCity)
    userDiv.append(userZipCode)
    userDiv.append(editButton)
    userDiv.append(deleteButton)

    displayPanel.append(userDiv)
}

function displayTeams() {
    let teams = currentUser.teams
    let div = document.createElement('div')
    //if user is part of atleast one team do this
    if (teams === undefined || teams.length === 0) {
        div.innerHTML = `<p>You are not part of any team.
        Click below to find a team to join, or create a team.</p>
        <button id='create-team-btn'>Create a team</button>
        <button id='find-team-btn'>Find a team</button>`

    }
    else {
        teams.forEach(function (team) {
            let teamName = document.createElement('h3')
            teamName.innerText = `${team.name}`
            div.append(teamName)
        })
    }
    displayPanel.append(div)

}

function displayPlayerMessages() {
    let rMessages = currentUser.recieved_messages
    let sMessages = currentUser.sent_messages
    if (rMessages.length === 0 && sMessages.length === 0) {
        noMessages = document.createElement('p')
        noMessages.innerText = "You have no messages."
        displayPanel.append(noMessages)
    } else {
        displayMessageInterface(rMessages, sMessages)
    }

}

function displayPlayersDiv() {
    let div = document.createElement('div')
    div.innerHTML = `<form class="player-search-form ui raised segment" style="background-color:#777">
    <input type="checkbox" id="near-me"> Near me<br>
    <input type="checkbox" id="by-name"> By name:
    <input type="text" id="name-input" placeholder="Enter player name" value=""><br>
    <input type="checkbox" id="by-level">
    <label>By Level</label>
               <select id = "myList">
                 <option>2.5</option>
                 <option>3.0</option>
                 <option>3.5</option>
                 <option>4.0</option>
                 <option>4.5</option>
                 <option>5.0</option>
                 <option>5.5</option>
                 <option>6.0</option>
               </select>
    <br>
    <input type="submit" value="Submit">
  </form>`
    displayPanel.append(div)
}

function renderNewTeamForm() {
    clearDisplayPanel()
    let form = document.createElement('form')
    form.innerHTML = "<input type='text' id='new-team-name-input' placeholder='Enter new team name' value=''> <input type='submit'>"
    form.className = "new-team-form"
    displayPanel.append(form)
}

function renderTeamSearchForm() {
    clearDisplayPanel()
    let form = document.createElement('form')
    form.innerHTML = "<input type='text' placeholder='Enter name of team' value=''> <input type='submit'>"
    form.className = "team-search-form"
    displayPanel.append(form)
}

function clearDisplayPanel() {
    displayPanel.innerHTML = ""
    currentChatPartner = { name: "", id: "" }
}

function createOrFindTeam(event) {
    console.log("clicked")
    if (event.target.id === "create-team-btn") {
        renderNewTeamForm()
    }
    else if (event.target.id === "find-team-btn") {
        renderTeamSearchForm()
    }
}

function displayPlayers(nearMe, byName, byLevel, name, level, data) {

    let players = data

    if (byLevel) {
        players = sortByLevel(players, level)
    }

    if (byName) {
        players = sortByName(players, name)
    }

    if (nearMe) {
        players = sortByZip(players)
    }
    clearDisplayPanel()
    displayPlayersDiv()
    if (players === undefined || players.length === 0) {
        noPlayersFound = document.createElement('p')
        noPlayersFound.innerText = "Sorry, no players were found matching that criteria"
        displayPanel.append(noPlayersFound)
    } else {
        players.forEach(function (player) {
            if (player.id !== currentUser.id) {
                playerInfo = new Player(player.id, player.name, player.level, player.city, player.zipcode, player.imageurl, player.created_at)
                playerDiv = document.createElement('div')
                playerDiv.innerHTML = playerInfo.html()
                displayPanel.append(playerDiv)

                $('.special.cards .image').dimmer({
                    on: 'hover'
                });
            }
        })
    }
}

function sortByLevel(players, level) {
    return players.filter(function (player) {
        return player.level === level
    })
}

function sortByZip(players) {
    return players.filter(function (player) {
        return player.zipcode <= currentUser.zipcode + 25 && player.zipcode >= currentUser.zipcode - 25
    })
}

function sortByName(players, name) {
    return players.filter(function (player) {
        return player.name.includes(name)
    })
}

function renderEditForm() {
    let form = document.createElement('form')
    form.className = "ui raised segment"
    form.id = "edit-form"
    form.innerHTML = `<label>Edit name</label>
    <input type="text" id="edit-name" value="${currentUser.name}"><br>
    <label>Edit player level</label>
           <select id = "edit-level" value="${currentUser.level}">
             <option>2.5</option>
             <option>3.0</option>
             <option>3.5</option>
             <option>4.0</option>
             <option>4.5</option>
             <option>5.0</option>
             <option>5.5</option>
             <option>6.0</option>
           </select><br>
    <label for="">Edit city</label>
    <input type="text" id="edit-city" value="${currentUser.city}"><br>
    <label for="">Edit zipcode</label>
    <input type="number" id="edit-zipcode" value="${currentUser.zipcode}"><br>
    <label for="">Profile picture url</label>
    <input type="text" id="edit-imageurl" value="${currentUser.imageurl}"><br>
    <input type="submit" value="Edit Profile">`

    displayPanel.append(form)
}

function logout() {
    signedInDivs.forEach(function (div) {
        div.style.display = 'none'
    })
    signUpDivs.forEach(function (div) {
        div.style.display = 'inline'
    })

    clearDisplayPanel()
    userIdField.id = ""
    currentUser = {}
}
function handleErrors(response) {
    if (!response.ok) throw Error(response.statusText);
    return response;
}

function renderConvoSideBar() {
    if (document.querySelector('#sideNav')) {
        displayPanel.removeChild(document.querySelector('#sideNav'))
    }
    let sideNav = document.createElement(`div`)
    sideNav.id = "sideNav"
    sideNav.className = "w3-sidebar w3-bar-block w3-card ui list segment raised"
    sideNav.style = "width:20%;right:0;position:fixed;top:105;background-color:#777;overflow: scroll"
    let h3 = document.createElement('h3')
    h3.innerText = "Conversations"
    sideNav.append(h3)
    //get array of names of ppl user is talking to and create a div ui segment for each w their name
    //append each one to sideNav, then
    let names = convoPartners()
    names.forEach(function (obj) {
        //sideNav.append(document.createElement('hr'))
        let name = document.createElement('div')
        name.dataset.id = obj.id
        name.innerText = obj.name
        name.className = "ui item"
        sideNav.append(name)
    })
    displayPanel.append(sideNav)

    sideNav.addEventListener('mouseover', (event) => {
        if (event.target.className.includes("item")) {
            event.target.style.background = "grey";
        }
    })

    sideNav.addEventListener('mouseout', (event) => {
        if (event.target.className.includes("item")) {
            event.target.style.background = "#777";
        }
    })

    sideNav.addEventListener('click', (event) => { openChatWindow(event) })
}

//gets uniq array of names of conversation partners
function convoPartners() {
    let names1 = currentUser.sent_messages.map(function (message) {
        return { name: message.reciever.name, id: message.reciever_id }
    })

    let names2 = currentUser.recieved_messages.map(function (message) {
        return { name: message.sender.name, id: message.sender_id }
    })

    let allNames = names1.concat(names2)
    //debugger
    return uniquify(allNames)
}

function uniquify(array) {
    let uniqArray = []
    array.forEach(function (obj) {
        if (!JSON.stringify(uniqArray).includes(JSON.stringify({ name: obj.name, id: obj.id }))) {
            uniqArray.push({ name: obj.name, id: obj.id })
        }
    })
    return uniqArray
}

function openChatWindow(event) {
    if (event.target.className.includes("item")) {
        createChatWindow(event.target.innerText, event.target.dataset.id)
    }
}

function createChatWindow(name, id) {
    currentChatPartner = { name: name, id: id }
    if (document.querySelector('.ui.comments.segment')) {
        displayPanel.removeChild(document.querySelector('.ui.comments.segment'))
    }

    let messageDiv = document.createElement('div')
    messageDiv.className = "ui comments segment"
    messageDiv.dataset.id = id
    messageDiv.style = "background-color:#777;position:fixed;bottom:0;right:25%;"
    messageDiv.innerHTML = `
    <h3 class="ui dividing header">${name}</h3>
    <div class="ui messages" style="height:380px;width:300px;overflow: scroll;word-break: break-all; word-wrap: break-word;">

    </div>
    <form class="ui reply form">
      <div class="field">
        <textarea id="the-message" style="height:-50px"></textarea>
      </div>
      <div class="ui blue labeled submit icon button send-btn">
        <i class="icon edit"></i> Send Message
      </div>
    </form>`

    chatwindowActive = true;
    displayPanel.append(messageDiv)
    orderMsgById(convoPartner(name)).forEach(function (message) {
        let msgHTML = new Message(message.sender.name, message.message_content, message.created_at)
        let div = document.createElement('div')
        div.className = "comment"
        div.innerHTML = msgHTML.html()
        document.querySelector('.messages').append(div)
        document.querySelector('.messages').scrollTop = document.querySelector('.messages').scrollHeight;
    })
}


function convoPartner(name) {
    let messages = currentUser.sent_messages.concat(currentUser.recieved_messages)

    let singleConvoMessage = messages.filter(function (message) {
        return message.sender.name === name || message.reciever.name === name
    })

    return singleConvoMessage
}

function renderSignInForm() {
    form = document.createElement('form')
    form.className = "signin-field"
    form.innerHTML = `
        <input type="number" id="signin-input" placeholder="Enter User Id #" value="">
        <input type="submit">`
    form.style = "position:absolute;top:50"
    displayPanel.append(form)

}

function orderMsgById(array) {
    return array.sort(function (a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return a.id - b.id;
    });
}
