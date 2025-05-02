package com.example.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int id;

  private String firstName;
  private String email;
  private String surname;
  private boolean verified;
  private String password;

  public User() {
    
  }
  public User(String firstName, String surname, String email, boolean verified, String password) {
    this.firstName = firstName;
	  this.surname = surname;
    this.email = email;
	  this.verified = false;
	  this.password = password;
  }

  public int getId() {
    return id;
  }

  public void setId(int id) {
    this.id = id;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }
  
  public String getSurname(){
	  return surname;
  }
  
  public void setSurname(String surname){
	  this.surname = surname;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }
  
  public boolean verified(){
	  return verified;
  }
  
  public void setVerified(boolean verified){
	  this.verified = verified;
  }
  
  public String getPassword(){
	  return password;
  }
  
  public void setPassword(String password){
	  this.password = password;
  }
}
