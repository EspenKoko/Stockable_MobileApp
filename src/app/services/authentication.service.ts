import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { User, LoginUser, UpdateUser, forgetPassword, resetPassword } from '../models/users';
import { Router } from '@angular/router';
import { ApiService } from './api-urls';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private userRoles: string[] = []; // Array to store user roles
  public loggedInUserRole!: string;

  private apiUrl = this.apiService.apiUrl;

  constructor(private httpClient: HttpClient,
    private apiService: ApiService,
    private router: Router,
    private storage: Storage) { }

  //password can eaither be generated or fixed for everyone
  generatePassword() {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const specialCharacters = "!@#$%^&*";
    let passwordText: string = 'Pass';

    let num = Math.floor(Math.random() * 10);

    let sCharIndex = Math.floor(Math.random() * specialCharacters.length); // Generate a random index within the range of the character array
    let selectedChar = specialCharacters[sCharIndex]; // Get the character at the randomly generated index

    for (let i = 0; i < 4; i++) {
      let letterIndex = Math.floor(Math.random() * alphabet.length); // Generate a random index within the range of the letters array
      let selectedLetter = alphabet[letterIndex]; // Get the letter at the randomly generated index
      passwordText = passwordText + selectedLetter;
    }
    const password = selectedChar + passwordText + num;
    return password;
  }

  getUser(UserId: string): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}Authenticate/GetUser` + "/" + UserId)
      .pipe(map(result => result))
  }

  getAllUsers(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}Authenticate/GetAllUsers`).pipe(map(result => result))
  }

  //why is there a .pipe here?
  register(user: User): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}Authenticate/Register`, user).pipe(map(result => result));
  }

  login(user: LoginUser) {
    return this.httpClient.post(`${this.apiUrl}Authenticate/Login`, user)
  }

  deleteUser(userId: string) {
    return this.httpClient.delete<string>(`${this.apiUrl}Authenticate/DeleteUser` + "/" + userId, this.apiService.httpOptions)
  }

  updateUser(userIdOrEmail: string, updateUser: UpdateUser) {
    return this.httpClient.put(`${this.apiUrl}Authenticate/UpdateUser/${userIdOrEmail}`, updateUser, this.apiService.httpOptions)
  }

  updateUserAccount(userIdOrEmail: string, updateUser: FormData) {
    return this.httpClient.put(`${this.apiUrl}Authenticate/UpdateUserAccount/${userIdOrEmail}`, updateUser, this.apiService.httpOptions)
  }

  removeProfilePicture(userIdOrEmail: string, updateUser: UpdateUser) {
    return this.httpClient.put(`${this.apiUrl}Authenticate/RemoveProfilePicture/${userIdOrEmail}`, updateUser, this.apiService.httpOptions)
  }

  // forgetPassword(userEmail: string): Observable<any> { // still works as a string even though sending as object (with one property)
  forgetPassword(userEmail: forgetPassword): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}Authenticate/ForgotPassword`, userEmail, this.apiService.httpOptions);
  }

  resetPassword(newPassword: resetPassword): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}Authenticate/ResetPassword`, newPassword, this.apiService.httpOptions);
  }

  async logout(): Promise<void> {
    await this.storage.remove("Token");
    // this.storage.clear();

    this.isAuthenticatedSubject.next(false);
    await this.router.navigateByUrl('/login');
  }

  // Method to retrieve user roles
  async getUserRoles(): Promise<string[]> {
    let Token: any;

    if (await this.storage.get("Token")) {
      Token = await this.storage.get("Token")!;
    }

    if (Token) {
      this.userRoles = JSON.parse(Token).role;
    }
    return this.userRoles;
  }

  async isAuthenticated(): Promise<boolean> {
    return await this.getToken() !== null;
  }

  private async getToken(): Promise<any> {
    return await this.storage.get("Token");
  }

  async getLoggedInUserId(): Promise<number | null> {
    const token = await this.storage.get('Token'); // Make sure to use 'await' here
  
    console.log('Token:', token); 
  
    if (token) {
      const userId = token.id; // Assuming the ID is stored in the token object
      return isNaN(userId) ? null : +userId; // Convert to a number or return null if it's not a valid number
    }
  
    return null;
  }
}
