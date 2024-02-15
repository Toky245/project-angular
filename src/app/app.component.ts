import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ViewChild, ElementRef } from '@angular/core';

/**
 * Interface representing the structure of a Student object.
 * This defines the properties expected for each student in the application.
 */
interface Student {
  id: string; 
  firstName: string;
  lastName: string;
  age: string;
  phoneNumber: string;
  class: string;
  mention: string; 
}

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet, CommonModule]
})

export class AppComponent {

  students: Student[] = []; // Array to store the list of students in the application. Initialized as an empty array.
  editingStudent: Student | null = null; // Represents the student currently being edited. If no student is being edited, it is set to null.
  searchResultMessage: string = ''; // Message to display for search results.
  // Indicates the success status of the search result.
  // If true, the search was successful; if false, it was not.
  searchResultSuccess: boolean = false;
  //Reference to the search input element in the HTML.
  // Using @ViewChild to get access to the input element.
  @ViewChild('searchInput', { static: false }) searchInput!: ElementRef;

  studentsPerPage: number = 8;
  currentPage: number = 1;

   // Variables pour compter le nombre d'élèves par mention et par classe
   countAES: number = 0;
   countRPM: number = 0;
   countDA2I: number = 0;
   countL1: number = 0;
   countL2: number = 0;
   countL3: number = 0;
   countM1: number = 0;
   countM2: number = 0;

   // AES
  countL1AES: number = 0;
  countL2AES: number = 0;
  countL3AES: number = 0;
  countM1AES: number = 0;
  countM2AES: number = 0;
   //RPM
   countL1RPM: number = 0;
   countL2RPM: number = 0;
   countL3RPM: number = 0;
   countM1RPM: number = 0;
   countM2RPM: number = 0;
   //DA2I
   countL1DA2I: number = 0;
   countL2DA2I: number = 0;
   countL3DA2I: number = 0;
   countM1DA2I: number = 0;
   countM2DA2I: number = 0;

  totalCount: number = 0;

  constructor() {
    // Récupérer les données du localStorage lors de l'initialisation
    const storedStudents = localStorage.getItem('students');
    this.students = storedStudents ? JSON.parse(storedStudents) : [];
  }
  addStudent() {
    // Réinitialisez les champs du formulaire avant d'ouvrir le formulaire modal
    this.resetForm();
  
    // Ouvrez le formulaire modal
    const modalElement = document.getElementById('exampleModal');
    if (modalElement) {
      modalElement.classList.add('show');
      modalElement.setAttribute('aria-hidden', 'false');
    }
  }
  

//function save student
  saveStudent() {
    const firstNameElement = document.getElementById('firstname') as HTMLInputElement;
    const lastNameElement = document.getElementById('lastname') as HTMLInputElement;
    const ageElement = document.getElementById('age') as HTMLInputElement;
    const phoneNumberElement = document.getElementById('descriPhone') as HTMLInputElement;
    const classElement = document.getElementById('SelectGrad') as HTMLSelectElement;
    const mentionElement = document.getElementById('Selectmention') as HTMLSelectElement; 
  
    if (
      firstNameElement &&
      ageElement &&
      phoneNumberElement &&
      classElement &&
      mentionElement
    ) {
      if (ageElement.value.trim() === '' || phoneNumberElement.value.trim() === '' || classElement.value.trim() === '') {
        // Affichez un message d'alerte si les champs obligatoires ne sont pas remplis
        this.showAlert('Please complete all required fields except last name if you do not have one.');
        return; // Arrêtez l'exécution si les champs obligatoires ne sont pas remplis
      }
  
      const maxPhoneNumberLength = 10;
      if (phoneNumberElement.value.length > maxPhoneNumberLength) {
        // Si la longueur du numéro de téléphone dépasse 10 chiffres, tronquez le numéro
        phoneNumberElement.value = phoneNumberElement.value.substring(0, maxPhoneNumberLength);
        
        this.showAlert('The phone number must have exactly 10 digits.');
      }
  
      if (this.editingStudent) {
        // Mise à jour des informations de l'étudiant en cours d'édition
        this.editingStudent.firstName = firstNameElement.value;
        this.editingStudent.lastName = lastNameElement.value;
        this.editingStudent.age = ageElement.value;
        this.editingStudent.phoneNumber = phoneNumberElement.value;
        this.editingStudent.class = classElement.value;
        this.editingStudent.mention = mentionElement.value; 
  
        // Réinitialisation de l'étudiant en cours d'édition
        this.editingStudent = null;
      } else {
        // Ajout d'un nouvel étudiant
        const newStudent: Student = {
          id: this.generateUniqueId(mentionElement.value),
          firstName: firstNameElement.value,
          lastName: lastNameElement.value,
          age: ageElement.value,
          phoneNumber: phoneNumberElement.value,
          class: classElement.value,
          mention: mentionElement.value 
        };
  
        this.students.push(newStudent);
        this.updateCounts();
        this.updatePagination();
      }
  
      // Mettez à jour le local storage et le tableau HTML
      localStorage.setItem('students', JSON.stringify(this.students));
      this.showAlert('Add sucessfully');
      this.resetForm();
    }
  }
  
//reset form
  resetForm() {
    const firstNameElement = document.getElementById('firstname') as HTMLInputElement;
    const lastNameElement = document.getElementById('lastname') as HTMLInputElement;
    const ageElement = document.getElementById('age') as HTMLInputElement;
    const phoneNumberElement = document.getElementById('descriPhone') as HTMLInputElement;
    const classElement = document.getElementById('SelectGrad') as HTMLSelectElement;

    if (firstNameElement && lastNameElement && ageElement && phoneNumberElement && classElement) {
      firstNameElement.value = '';
      lastNameElement.value = '';
      ageElement.value = '';
      phoneNumberElement.value = '';
      classElement.value = '';
    }
    this.updateCounts();
  }

//edit form
  editStudent(student: Student) {
    this.editingStudent = student;
  
    const modalElement = document.getElementById('exampleModal');
    if (modalElement) {
      const firstNameElement = document.getElementById('firstname') as HTMLInputElement;
      const lastNameElement = document.getElementById('lastname') as HTMLInputElement;
      const ageElement = document.getElementById('age') as HTMLInputElement;
      const phoneNumberElement = document.getElementById('descriPhone') as HTMLInputElement;
      const classElement = document.getElementById('SelectGrad') as HTMLSelectElement;
  
      if (
        firstNameElement &&
        lastNameElement &&
        ageElement &&
        phoneNumberElement &&
        classElement &&
        this.editingStudent
      ) {
        // Remplir le formulaire avec les détails de l'étudiant à éditer
        firstNameElement.value = this.editingStudent.firstName;
        lastNameElement.value = this.editingStudent.lastName;
        ageElement.value = this.editingStudent.age;
        phoneNumberElement.value = this.editingStudent.phoneNumber;
        classElement.value = this.editingStudent.class;
  
        // Afficher le formulaire modal pour l'édition
        modalElement.classList.add('show');
        modalElement.setAttribute('aria-hidden', 'false');
      }
      this.updateCounts();
    }
  }
  
//Delete student in table and localstorage
deleteStudent(student: Student) {
  // Logique pour supprimer un étudiant
  const index = this.students.findIndex(s => s.id === student.id);
  if (index !== -1) {
    this.students.splice(index, 1);
    localStorage.setItem('students', JSON.stringify(this.students));
    this.showAlert('Student deleted successfully!');
    
    // Mettre à jour le compteur après la suppression de l'étudiant
    this.updateCounts();
    this.updatePagination();
  }
}


  // Fonction pour mettre à jour les compteurs
  updateCounts() {
    // Réinitialiser les compteurs existants
    this.countAES = 0;
    this.countRPM = 0;
    this.countDA2I = 0;
    this.countL1 = 0;
    this.countL2 = 0;
    this.countL3 = 0;
    this.countM1 = 0;
    this.countM2 = 0;

    // aes
    this.countL1AES = 0;
    this.countL2AES = 0;
    this.countL3AES = 0;
    this.countM1AES = 0;
    this.countM2AES = 0;
    //rpm
   this.countL1RPM = 0;
    this.countL2RPM = 0;
    this.countL3RPM = 0;
    this.countM1RPM = 0;
    this.countM2RPM = 0;
    //da2i
    this.countL1DA2I = 0;
    this.countL2DA2I = 0;
    this.countL3DA2I = 0;
    this.countM1DA2I = 0;
    this.countM2DA2I = 0;

    // Parcourir tous les étudiants pour mettre à jour les compteurs
    this.getStudentsForCurrentPage().forEach(student => {
      switch (student.mention) {
        case 'AES':
          this.countAES++;
          break;
        case 'RPM':
          this.countRPM++;
          break;
        case 'DA2I':
          this.countDA2I++;
          break;
      }
      //CASE AES
      switch (student.class) {
        case 'L1':
          this.countL1++;
          if (student.mention === 'AES') {
            this.countL1AES++;
          }
          break;
        case 'L2':
          this.countL2++;
          if (student.mention === 'AES') {
            this.countL2AES++;
          }
          break;
        case 'L3':
          this.countL3++;
          if (student.mention === 'AES') {
            this.countL3AES++;
          }
          break;
        case 'M1':
          this.countM1++;
          if (student.mention === 'AES') {
            this.countM1AES++;
          }
          break;
        case 'M2':
          this.countM2++;
          if (student.mention === 'AES') {
            this.countM2AES++;
          }
          break;
      }
      //CASE RPM
      switch (student.class) {
        case 'L1':
          this.countL1++;
          if (student.mention === 'RPM') {
            this.countL1RPM++;
          }
          break;
        case 'L2':
          this.countL2++;
          if (student.mention === 'RPM') {
            this.countL2RPM++;
          }
          break;
        case 'L3':
          this.countL3++;
          if (student.mention === 'RPM') {
            this.countL3RPM++;
          }
          break;
        case 'M1':
          this.countM1++;
          if (student.mention === 'RPM') {
            this.countM1RPM++;
          }
          break;
        case 'M2':
          this.countM2++;
          if (student.mention === 'RPM') {
            this.countM2RPM++;
          }
          break;
      }
      //CASE DA2I
      switch (student.class) {
        case 'L1':
          this.countL1++;
          if (student.mention === 'DA2I') {
            this.countL1DA2I++;
          }
          break;
        case 'L2':
          this.countL2++;
          if (student.mention === 'DA2I') {
            this.countL2DA2I++;
          }
          break;
        case 'L3':
          this.countL3++;
          if (student.mention === 'DA2I') {
            this.countL3DA2I++;
          }
          break;
        case 'M1':
          this.countM1++;
          if (student.mention === 'DA2I') {
            this.countM1DA2I++;
          }
          break;
        case 'M2':
          this.countM2++;
          if (student.mention === 'DA2I') {
            this.countM2DA2I++;
          }
          break;
      }
    });

    // Mettre à jour le compteur total d'élèves
    this.totalCount = this.students.length;
  }
  updatePagination() {
    const totalPages = Math.ceil(this.students.length / this.studentsPerPage);
    if (this.currentPage > totalPages) {
      this.currentPage = totalPages;
    }
  }
  

  showAlert(message: string) {
    alert(message);
  }
//generer l'id automatiquement pour les chiffres 
  generateUniqueId(mention: string) {
    // Générer 4 chiffres aléatoires
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
  
    // Ajouter la lettre correspondant à la mention à la deuxième position
    let modifiedId = randomDigits.toString().substring(0, 1) + mention.charAt(0) + randomDigits.toString().substring(1);
  
    return modifiedId;
  }
  //search function
  searchStudents() {
    const searchTerm = this.searchInput.nativeElement.value.toLowerCase().trim();
  
    // Vérifier si l'utilisateur a saisi quelque chose
    if (!searchTerm) {
      // Afficher la notification pour demander d'entrer l'id ou le numéro de téléphone
      this.showSearchResult(false, 'Please enter the ID or phone number to search.');
      return;
    }
  
    // Vérifier si l'utilisateur a saisi "id" ou "phone number"
    if (searchTerm !== 'id' && searchTerm !== 'phone number') {
      // Filtrer les étudiants en fonction du numéro de téléphone ou du matricule
      const filteredStudents = this.students.filter(student =>
        student.phoneNumber.toLowerCase().includes(searchTerm) ||
        student.id.toLowerCase().includes(searchTerm)
      );
  
      if (filteredStudents.length > 0) {
        // Affiche la notification de succès
        this.showSearchResult(true, `Student found - ID: ${filteredStudents[0].id}, First Name: ${filteredStudents[0].firstName}, Last Name: ${filteredStudents[0].lastName}, Phone Number: ${filteredStudents[0].phoneNumber}, Age: ${filteredStudents[0].age}, Class: ${filteredStudents[0].class}, Mention: ${filteredStudents[0].mention}`);
      } else {
        // Affiche la notification d'erreur
        this.showSearchResult(false, 'Student not found or not registered.');
      }
    } else {
      // Afficher la notification en anglais pour utiliser l'id ou le numéro de téléphone
      this.showSearchResult(false, 'Please use "id" or "phone number" for the search option.');
    }
  }
  
  
  showSearchResult(success: boolean, message: string) {
    this.searchResultSuccess = success;
    this.searchResultMessage = message;
  }
  
  //clear search
  clearSearchResult() {
    this.searchResultMessage = '';
    this.searchResultSuccess = false;
  }
  //pagination index
  getStudentsForCurrentPage(): Student[] {
    const startIndex = (this.currentPage - 1) * this.studentsPerPage;
    const endIndex = startIndex + this.studentsPerPage;
    return this.students.slice(startIndex, endIndex);
  }
  //previous 
previousPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.updateCounts();
  }
}
//next
nextPage() {
  if (this.currentPage * this.studentsPerPage < this.students.length) {
    this.currentPage++;
    this.updateCounts();
  }
}
  
  
}
