# React-iNotebook

It is a full-stack MERN application which saves your personal notes on the mongoDB atlas through React frontend integrated with authentication also.

## Development server

### Linux - Debian
<li>Installing node js & nodemon</li>

```cmd
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.3/install.sh | bash
nvm install node
npm install -g nodemon
```

<li>Installing mongodb</li>

```cmd
sudo apt-get install gnupg
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
```

<li>Downloading project code & running server</li>

```cmd
git clone https://github.com/Himesh-29/React-iNotebook.git
cd React-iNotebook
npm --prefix ./backend install
npm --prefix ./frontend install
npm install
sudo service mongod start
npm run both
```

<li>Uninstalling Code</li>

First stop server by ctrl+C.

```cmd
sudo service mongod stop
cd ..
rm -rf React-iNotebook
```

### Linux - Arch
<li>Installing node js & nodemon</li>

```cmd
sudo pacman -S nodejs npm
npm install -g nodemon
```

<li>Installing mongodb</li>

```cmd
git clone https://aur.archlinux.org/mongodb-bin.git
cd mongodb-bin
makepkg -si
cd ..
rm -rf mongodb-bin
```

<li>Downloading project code & running server</li>

```cmd
git clone https://github.com/Himesh-29/React-iNotebook.git
cd React-iNoteBook
npm --prefix ./backend install
npm --prefix ./frontend install
npm install
systemctl start mongodb
npm run both
```

<li>Uninstalling Code</li>

First stop server by ctrl+C.

```cmd
systemctl stop mongodb
cd ..
rm -rf React-iNotebook
```

### Windows
<p>Install node js from https://nodejs.org/en/</p>
<p>Install mongodb from https://www.mongodb.com/try/download/community</p>

<li>Installing nodemon</li>

```cmd
npm install -g nodemon
```

<li>Downloading project code & running server</li>

```cmd
git clone https://github.com/Himesh-29/React-iNotebook
cd React-iNoteBook
npm --prefix ./backend install
npm --prefix ./frontend install
npm install
npm run both
```

<li>Uninstalling Code</li>

First stop server by ctrl+C.

```cmd
cd ..
rmdir /S React-iNotebook
```

## Note
You can download mongodb compass to visualize your database from https://www.mongodb.com/try/download/compass
