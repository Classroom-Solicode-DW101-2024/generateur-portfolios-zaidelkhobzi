class Student {
    constructor(nom, prenom, email, phone, groupe) {
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.phone = phone;
        this.groupe = groupe;
        this.projects = [];
    }

    // Method to add a project to the student's projects array
    addProject(project) {
        this.projects.push(project);
    }
}
class Project {
    constructor(intitulé, comptétences, date_réalisation, lien_github) {
        this.intitulé = intitulé;
        this.comptétences = comptétences;
        this.date_réalisation = date_réalisation;
        this.lien_github = lien_github;
    }
}

/**************** JS For infos.html ****************/

let nom = document.getElementById('nom');
let prenom = document.getElementById('prenom');
let email = document.getElementById('email');
let phone = document.getElementById('phone');
let groupe = document.getElementById('groupe');
let suivant = document.getElementById('suivant');

// Phone format regex: +212XXX-XX-XX-XX
const phoneFormat = /^\+212\d{3}-\d{2}-\d{2}-\d{2}$/;

function clearForm() {
    nom.value = "";
    prenom.value = "";
    email.value = "";
    phone.value = "";
    groupe.value = "";
};

let newStudent;

if (suivant) {

    suivant.addEventListener('click', (e) => {
        e.preventDefault();

        if (nom.value === "" || 
            nom.value.startsWith(" ") ||
            prenom.value === "" || 
            prenom.value.startsWith(" ") ||
            email.value === "" || 
            email.value.startsWith(" ") ||
            phone.value === "") {
            alert('Please fill all the fields without leading spaces!');
            return;
        };

        // Retrieve the values of nom, prenom
        let nomValue = nom.value.replace(/\s+/g, '');  // Remove spaces from nom
        let prenomValue = prenom.value.replace(/\s+/g, '');  // Remove spaces from prenom
        // Create the email format
        let formattedEmail = `${nomValue}.${prenomValue}.solicode@gmail.com`;

        // Validate Email
        if (formattedEmail !== email.value) {
            alert('Please respect this format in email: nom.prenom.solicode@gmail.com');
            return;
        };

        // Validate phone format
        if (!phoneFormat.test(phone.value)) {
            alert('Please enter the phone number in this format: +212XXX-XX-XX-XX');
            return;
        };
    
        newStudent = new Student(nom.value, prenom.value, email.value, phone.value, groupe.value);
    
        // Store newStudent in localStorage
        localStorage.setItem('newStudent', JSON.stringify(newStudent));
    
        console.log(newStudent);
    
        // If all fields are filled, navigate to projects.html
        window.open("projects.html", "_blank");
    
        clearForm();
    });
};

/**************** JS For projects.html ****************/

let titreProjet = document.getElementById("titre-projet");
let lienGithub = document.getElementById("lien-github");
const dateRealisation = document.getElementById('date-realisation');
let validBtn = document.getElementById("valider");
let finishBtn = document.getElementById("finish");
let projectsCreated = document.querySelector('.projects-created');

function clearFormProject() {
    document.getElementById("projects-forms").reset();
    
    /* Loop through each checkbox and uncheck it
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    }); */
}

// Retrieve newStudent from localStorage
let storedStudent = JSON.parse(localStorage.getItem('newStudent'));

if (storedStudent) {
    let newStudent = Object.assign(new Student(), storedStudent);
    console.log(newStudent);

    if (validBtn) {
        validBtn.addEventListener('click', (e) => {
            e.preventDefault();

            const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');

            if (titreProjet.value.trim() === "" || 
                titreProjet.value.startsWith(" ") || 
                lienGithub.value.trim() === "" || 
                lienGithub.value.startsWith(" ") || 
                dateRealisation.value === "" || 
                checkboxes.length === 0) {
                alert('Please fill all the fields without leading spaces!');
                return;
            }

            if (dateRealisation.value) {
                const currentDate = new Date(dateRealisation.value);
                const today = new Date();
            
                if (currentDate > today) {
                    alert("The selected date cannot be in the future.");
                    return;
                }
            }

            /** 
             * dateRealisation.value === ""
             * checkboxes.length === 0
            */
        
            function competencesChecked() {
                // Dynamically retrieve the checkboxes each time the function is called
                const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
                let competences = [];
                for (const item of checkboxes) {
                    if (item.checked) {
                        competences.push(item.value)
                    };
                };
                return competences;      
            };
        
            const newProjet = new Project(titreProjet.value, competencesChecked(), dateRealisation.value, lienGithub.value);
        
            newStudent.addProject(newProjet);

            console.log(newProjet);
            console.log(Student.projects);
    
            localStorage.setItem('newStudent', JSON.stringify(newStudent));
           
            projectsCreated.innerHTML += `
                <div class="projects-realises">
                    <div>
                        <label class="titre-projet">Intitulé: </label>
                        <span class="project-title">${titreProjet.value}</span>
                    </div>
                    <div>
                        <label class="lien-github">Lien Github: </label>
                        <span class="project-lien-github">${lienGithub.value}</span>
                    </div>
                    <div>
                        <label class="competences">Compétences visées: </label>
                        <span>${competencesChecked()}</span>
                    </div>
                    <div>
                        <label class="date-realisation">Date Réalisation: </label>
                        <span class="project-date-realisation">${dateRealisation.value}</span>
                    </div>
                    <button class="edit">Edit</button>
                    <button class="delete">Delete</button>
                </div>
            `;

            if (projectsCreated) {
                projectsCreated.addEventListener("click", (e) => {
                    if (e.target.classList.contains("edit")) {
                        const projectDiv = e.target.closest(".projects-realises");
                        const titleElement = projectDiv.querySelector(".project-title");
                        const lienGithubElement = projectDiv.querySelector(".project-lien-github");
                        const dateRealisationElement = projectDiv.querySelector(".project-date-realisation");

                        // Capture existing title, lien-github & dateRealisation from the input
                        titreProjet.value = titleElement.innerText;
                        lienGithub.value = lienGithubElement.innerText;
                        dateRealisation.value = dateRealisationElement.innerText;
            
                        // Checks if a save button already exists and removes it to prevent duplicates
                        let existingSaveBtn = projectDiv.querySelector(".save-btn");
                        if (existingSaveBtn) {
                            existingSaveBtn.remove(); // Remove existing Save button
                        };
            
                        // Create and append the save button
                        const saveBtn = document.createElement("button");
                        saveBtn.textContent = "Save";
                        saveBtn.classList.add("save-btn"); // Add a class to easily identify it
                        projectDiv.appendChild(saveBtn);
            
                        saveBtn.addEventListener("click", () => {
                            // Update title, lien-github & dateRealisationElement in the DOM
                            titleElement.innerText = titreProjet.value;
                            lienGithubElement.innerText = lienGithub.value;
                            dateRealisationElement.innerHTML = dateRealisation.value;

                            // Update the title in the `newStudent` project list
                            const projectIndex = Array.from(projectsCreated.children).indexOf(projectDiv);
                            newStudent.projects[projectIndex].intitulé = titreProjet.value;
                            newStudent.projects[projectIndex].lien_github = lienGithub.value;
                            newStudent.projects[projectIndex].date_réalisation = dateRealisation.value;
            
                            // Update localStorage
                            localStorage.setItem("newStudent", JSON.stringify(newStudent));
            
                            // Remove save button and clear form
                            projectDiv.removeChild(saveBtn);
                            clearFormProject();
                        });
                    }
                    else if (e.target.classList.contains("delete")) {
                        e.target.closest(".projects-realises").remove();
                    }
                });
            }
            clearFormProject();
        });
    }
}

/**************** JS For cv.html ****************/

if (finishBtn) {
    finishBtn.addEventListener('click', (e) => {
        e.preventDefault();
    
        let newStudent = Object.assign(new Student(), storedStudent);
    
        if (newStudent.projects.length > 0) {
            window.open("portfolio.html", "_blank");
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    let newStudent = Object.assign(new Student(), storedStudent);

    let cv = document.querySelector('.curriculum-vitae');
    if (cv) {
        cv.innerHTML += `
            <div class="infos-perso">
                <h1 style="margin: 0; margin-bottom: 10px;">Infos Personels</h1>
                <div>
                    <label>Nom: </label>
                    <span>${newStudent.nom}</span>    
                </div>
                <div>
                    <label>Prenom: </label>
                    <span>${newStudent.prenom}</span>
                </div>
                <div>
                    <label>Email: </label>
                    <span>${newStudent.email}</span>    
                </div>
                <div>
                    <label>Phone: </label>
                    <span>${newStudent.phone}</span></label>
                </div>
                <div>
                    <label>Groupe: </label>
                    <span>${newStudent.groupe}</span>
                </div>
            </div>
        `;
    
        for (let i = 0; i < newStudent.projects.length; i++) {
            cv.innerHTML += `
                <div class="projects">
                    <h1 style="margin: 0; margin-bottom: 10px;">Project ${i+1}</h1>
                    <div>
                        <label>Intitulé: </label>
                        <span>${newStudent.projects[i].intitulé}</span>
                    </div>
                    <div>
                        <label>Competences: </label>
                        <span>${newStudent.projects[i].comptétences}</span>
                    </div>
                    <div>
                        <label>Date Réalisation: </label>
                        <span>${newStudent.projects[i].date_réalisation}</span>
                    </div>
                    <div>
                        <label>Lien Github: </label>
                        <span>${newStudent.projects[i].lien_github}</span>
                    </div>
                </div>
            `;
    }
    }

    // Add the "Télécharger" button
    const downloadButton = document.createElement("button");
    downloadButton.innerText = "Télécharger";
    downloadButton.id = "download-button";
    if (cv) {
        cv.appendChild(downloadButton);
    }

    downloadButton.style.display = "block";

    // Add event listener for PDF download
    downloadButton.addEventListener("click", () => {
        downloadButton.style.display = "none";
        html2pdf().from(cv).set({
            margin: 1,
            filename: `${newStudent.nom}_${newStudent.prenom}_CV.pdf`,
            html2canvas: { scale: 2 },
            jsPDF: { format: 'a4', orientation: 'portrait' }
        }).save().then(() => {
            downloadButton.style.display = "block"; // Show the button again after download
        });
    });
});