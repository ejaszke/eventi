export default class Client {

  constructor(firstName, lastName, email) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }

  get name(){
    return this.firstName + ' ' + this.lastName;
  }

}

