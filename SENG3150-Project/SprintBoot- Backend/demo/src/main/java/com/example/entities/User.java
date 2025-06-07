package com.example.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.CascadeType;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.ArrayList;

@Entity
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int id;

  private String firstName;

  @Column(unique = true)
  private String email;

  private String surname;
  private boolean verified;
  private String password;

  private String emailCode;
  private String emailCodeSent;
  private String emailCodeReceived;
  private String emailCodeSentTo;

  @JsonIgnore
  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Session> sessions = new ArrayList<>();
  
  public User(){}
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
  
  public String getEmailCode() {
    return emailCode;
  }



  public String getEmailCodeSent() {
    return emailCodeSent;
  }
  public void setEmailCodeSent(String emailCodeSent) {
    this.emailCodeSent = emailCodeSent;
  }
  public String getEmailCodeReceived() {
    return emailCodeReceived;
  }
  public void setEmailCodeReceived(String emailCodeReceived) {
    this.emailCodeReceived = emailCodeReceived;
  }
  public String getEmailCodeSentTo() {
    return emailCodeSentTo;
  }
  public void setEmailCodeSentTo(String emailCodeSentTo) {
    this.emailCodeSentTo = emailCodeSentTo;
  }

  public List<Session> getSessions(){
    return sessions;
  }

  public void setSessions(List<Session> sessions) {
    this.sessions = sessions;
  }

}
