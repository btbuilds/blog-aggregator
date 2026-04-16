# gator

A CLI tool for aggregating RSS feeds and browsing posts from the terminal.

## Prerequisites

Before running `gator`, make sure you have:

- Node.js installed
- npm installed
- PostgreSQL installed and running
- A PostgreSQL database created for this project

## Installation

Clone the repository:

```bash
git clone <your-repo-url>
cd <your-repo-folder>
```

Install dependencies:

```bash
npm install
```

## Configuration

Create a config file for `gator` in your home directory named `.gatorconfig.json` and add the required settings:

- database connection string
- current username

Example:
```json
{
  "db_url": "postgres://username:password@localhost:5432/gator",
  "current_user_name": "username"
}
```

This must exist before running any commands.

## Database Setup:

Run the migration for the database. This assumes you have the `.gatorconfig.json` setup properly and a Postgres database running.
```bash
npm run migrate
```

## Usage:

Run commands with:

```bash
npm run start <command>
```

List of commands and brief description:
```bash
login <username>     - Login with the specified username
register <username>  - Register the specified username to the database
reset                - Reset the databases
users                - List all registered users
agg <interval>       - Fetch all feeds. Usage: npm run start agg 60s
addfeed <name> <url> - Add a feed and follow it with the logged in user
feeds                - List all added feeds
follow <feed_url>    - Follow a feed
following            - List all feeds current user is following
unfollow <feed_url>  - Unfollow a feed
browse <limit>       - List posts from followed feeds. Optional: specify a limit, default is 2 if not specified
```
