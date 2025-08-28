<a id="readme-top"></a>

# QlikShift Backend

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

QlikShift is a web application that streamlines shift assignments by ensuring that each team member is placed where they're needed most, when they're needed mostdesigned to manage and process student data. This repository contains the backend implementation built using Next.js.


### Built With

This section should list any major frameworks/libraries used in this project.

* [![Next][Next.js]][Next-url]
* [![React][React.js]][React-url]

<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

* You should have node installed
  ```sh
  node -v
  npm -v 
  ```
* If not installed install homebrew then install node
```sh
  # first install homebrew (follow instructions given after installation) --> Do this in your root terminal
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  # then install node
  brew install node
```


### Installation

_Follow the instruction below to get started._

1. Clone the repo
   ```sh
   git clone https://github.com/EKasuti/qlikshift_backend.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Create .env file (reference .env.example)
   ```sh
   touch .env
   ```
4. Run it locally
   ```sh
   npm run dev
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>


# API Endpoints

All API routes are located in `app/api/`

**Student Apis**
| Method   | Endpoint                     | Description                     |
|----------|------------------------------|---------------------------------|
| `GET`    | `/api/students/term`         | Get all Term students           |
| `GET`    | `/api/students/term/:id`     | Get a single Term student       |
| `POST`   | `/api/students/term/`        | Upload Term students            |
| `GET`    | `/api/students/interim`      | Get all Interim students        |
| `GET`    | `/api/students/interim/:id`  | Get a single Interim student    |
| `POST`   | `/api/students/interim/`     | Upload Interim students         |


**Desks Apis**

| Method   | Endpoint                               | Description                     |
|----------|----------------------------------------|---------------------------------|
| `GET`    | `/api/desks/term`                      | Gets Term Desks                 |
| `POST`   | `/api/desks/term`                      | Creates a Term Desk             |
| `GET`    | `/api/desks/term/export`               | Exports Term Calendar           |
| `GET`    | `/api/desks/term/availableStudents`    | Get available Term Students     |
|----------|----------------------------------------|---------------------------------|
| `GET`    | `/api/desks/interim`                   | Gets Interim Desk               |
| `POST`   | `/api/desks/interim`                   | Creates a Interim Desk          |
| `GET`    | `/api/desks/interim/export`            | Exports Interim Calendar        |
| `GET`    | `/api/desks/interim/availableStudents` | Get available Interim Students  |
|----------|----------------------------------------|---------------------------------|



<!-- CONTRIBUTING -->
## Contributing

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- LICENSE -->
## License

Distributed under the Unlicense License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

Emmanuel Kasuti Makau - [@linkedin](https://www.linkedin.com/in/emmanuel-kasuti/) - emmanuel.k.makau.jr.26@dartmouth.edu

Project Link: [github repo](https://github.com/EKasuti/qlikshift_backend.git)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/