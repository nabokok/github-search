
class Github {
  constructor() {
    this.clientId = 'd01d41518c3d1dea8d42';
    this.clientSecret = '88f84682362e8cf280f338337b8bdd85af97c443';
  }

  async getUser(userName) {
    const data = await fetch(`https://api.github.com/users/${userName}?client_id=${this.clientId}&client_secret=${this.clientSecret}`);
    const profile = await data.json();
    return profile;
  }

  async getRepos(userName) {
    const data = await fetch(` https://api.github.com/users/${userName}/repos?client_id=${this.clientId}&client_secret=${this.clientSecret}`);
    const repos = await data.json();
    return repos;
  }

}

class UI {
  constructor() {
    this.profile = document.querySelector('.profile');
    this.repos = document.querySelector('.repos');
  }

  showProfile(user) {
    this.profile.innerHTML = `
      <div class="card card-body mb-3">
        <div class="row">
          <div class="col-md-3">
            <img class="img-fluid mb-2" src="${user.avatar_url}">
            <a href="${user.html_url}" target="_blank" class="btn btn-primary btn-block mb-4">View Profile</a>
          </div>
          <div class="col-md-9">
            <span class="badge badge-primary">Public Repos: ${user.public_repos}</span>
            <span class="badge badge-secondary">Public Gists: ${user.public_gists}</span>
            <span class="badge badge-success">Followers: ${user.followers}</span>
            <span class="badge badge-info">Following: ${user.following}</span>
            <br><br>
            <ul class="list-group">
              <li class="list-group-item">Company: ${user.company}</li>
              <li class="list-group-item">Website/Blog: ${user.blog}</li>
              <li class="list-group-item">Location: ${user.location}</li>
              <li class="list-group-item">Member Since: ${user.created_at}</li>
            </ul>
          </div>
        </div>
      </div>
      <h3 class="page-heading mb-3">Latest Repos</h3>
    
    `
  }

  showRepos(repos) {
    const ul = document.createElement('ul');
    this.repos.appendChild(ul);
    repos.sort((a, b) => a.created_at > b.created_at ? 1 : -1)
    const lastRepos = repos.slice(-5);

    lastRepos.map(repo => {
      const li = document.createElement('li');
      const a = document.createElement('a')
      ul.appendChild(li).appendChild(a);
      a.innerHTML = repo.full_name;
      a.setAttribute('href', repo.html_url);
      a.setAttribute('target', '_blank')
    })
  }

  showAlert(message, className) {
    this.clearAlert();
    const div = document.createElement('div');
    div.className = className;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.searchContainer');
    const search = document.querySelector('.search');
    container.insertBefore(div, search);

    setTimeout(() => {
      this.clearAlert();
    }, 2000)
  }

  clearAlert() {
    const alertBlock = document.querySelector('.alert');
    if(alertBlock) {
      alertBlock.remove();
    }
  }

  clearProfile() {
    this.profile.innerHTML = '';
  }

  clearRepos() {
    this.repos.innerHTML = '';
  }
}

const github = new Github;
const ui = new UI;

const searchUser = document.querySelector('.searchUser');



function debounce(func, timeout = 500){
  let timer;
  return (e) => {
    clearTimeout(timer);

    timer = setTimeout(() => { 
      func(e);
     }, timeout);
  };
}

function saveInput(e){
  ui.clearRepos();
  const userText = e.target.value;

  if(userText.trim() !== '') {
    github.getUser(userText)
      .then(data => {
        if(data.message === 'Not Found') {
          // показувати помилку
          ui.showAlert('User not found', 'alert alert-danger');
        } else {
          ui.showProfile(data);

        }
      })
      github.getRepos(userText)
      .then(data => {
        if(data.length === 0) {
          // показувати помилку
          ui.showAlert('Repos not found', 'alert alert-danger');
        } else {
          ui.showRepos(data);
        }
      })
  } else {
    // очистити інпут пошуку
    ui.clearProfile();
  }
  
}
const processChange = debounce((event) => saveInput(event));

searchUser.addEventListener('keyup', processChange)
