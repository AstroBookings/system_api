import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './models/register.dto';
import { UserTokenDto } from './models/user-token.dto';
import { UserDto } from './models/user.dto';

/*
```gherkin
Feature: User Registration
  As a visitor, I want to register an account, so that I can access the system.


  Scenario: Register a new user
    Given the API is available
    When the user sends a POST request to "/api/authentication/register" with the following data:
      | name     | email                | password    | role     |
      | "John Doe" | "johndoe@example.com" | "password123" | "traveler" |
    Then the response should have a status code of 201
    And the response should contain a field "token" with a JWT value
    And the response should contain a field "user" with the user information
    And the "user" should not contain a field "password"

  Scenario: Register with an existing email
    Given the API is available
    When the user sends a POST request to "/api/authentication/register" with the following data:
      | name     | email                | password    | role     |
      | "John Doe" | "johndoe@example.com" | "password123" | "traveler" |
    Then the response should have a status code of 409
    And the response should contain an error message "Email already in use"
```
*/

@Controller('authentication')
export class AuthenticationController {
    constructor(private readonly authenticationService: AuthenticationService) { }

    @Post('register')
    async register(@Body() registerDto: RegisterDto): Promise<UserTokenDto> {
        return this.authenticationService.register(registerDto);
    }

    /**
     * Deletes a user by their ID.
     * @param id - The ID of the user to delete.
     * @returns A promise that resolves to void when the user is successfully deleted.
     */
    @Delete(':id')
    async deleteUser(@Param('id') id: string): Promise<void> {
        console.log('👽 deleting user', id);
        return this.authenticationService.deleteUser(id);
    }

    @Get(':id')
    async getUser(@Param('id') id: string): Promise<UserDto> {
        console.log('geting user', id);
        return this.authenticationService.getById(id);
    }

}
