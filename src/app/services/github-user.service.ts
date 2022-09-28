import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GithubUserService {

  async validGithubUsername(username: string): Promise<boolean> {
    //let validUsername: boolean;
    const response = await fetch(`https://api.github.com/users/${username}`);
    console.log(username, response);
    
    return response.status === 200;
  }
}