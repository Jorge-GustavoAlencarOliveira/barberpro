export class AuthTokenErrors extends Error{
  constructor() {
    super('Error with Authentication token')
  }
}