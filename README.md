# jumia-travel-changelog-generator
Small but efficient tool to generate a CHANGELOG.md file for cross functional teams

## The CHANGELOG.md generator
This tool is meant to generate automatically an extended and useful CHANGELOG.md report.
Each release is based on a milestone version and the due date.

## Jumia Travel Submission Guidelines
In order to generate a precise report, some guideline are requested to be followed:

- Each release should be based on a milestone
  - opened milestones are considered future releases
  - closed milestones are considered released and the close date is the release date
- A `TAG` should share the same name as the `milestone` e.g **V1.0.0** This will facilitate the creation of some links
- Pull request
  - Should be assigned to the milestone where they are meant to be released
  - comment should be meaningful, only the pull request comments are reported
  - Certain labels will group pull requests in `categories` make sure you assign meaningful labels to pull requests
    - **enhancement** group by **Improvements**
    - **bug** group by **Fixes**
    - any other or no labels will be assigned to **Others**

## Install and run this program

install this project:

make sure you have nodejs installed

~~~~
node --version
~~~~

You should see something like:

~~~~
v6.10.0
~~~~

If you don't have nodejs installed check [here](https://nodejs.org/en/download/)

~~~~
npm install jumia-travel-changelog --save
~~~~

## Options

Before running you should know about the available options:

<table>
    <tr>
        <td>token</td>
        <td>Github API personal access token, you can generate one <a target="_blank" href="https://github.com/settings/tokens/new">here</a></td>
    </tr>
    <tr>
        <td>repo</td>
        <td>the repo owner name and repo name e.g. <strong>josemsantos/jumia-travel-changelog-generator</strong></td>
    </tr>
    <tr>
        <td>start</td>
        <td>The initial date to start the changelog, useful for projects that already has a CHANGELOG.md file. The format as to be YYYY-mm-dd e.g. 2015-03-21.</td>
    </tr>
    <tr>
        <td>baselog</td>
        <td>In case you already have a CHANGELOG.md file you can append it in your new one, just pass the path of your current file.</td>
    </tr>
</table>

You can execute the program as

~~~~
jumia-travel-changelog --token=ff2c276a78d7b795e65c2da99fc7d44e68fc6c2e --repo=josemsantos/jumia-travel-changelog-generator --baselog=/var/www/my-project/CHANGELOG-MANUAL.md
~~~~

