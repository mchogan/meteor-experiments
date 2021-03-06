A collection of Meteor.js experiments.
* svg
* d3-line-graph

## Development Tools
I've found the following development tools to be quite helpful.
* [Brackets](http://brackets.io) text editor
* [Robomongo](http://robomongo.org) inspector for MongoDB
* [Node Inspector](https://github.com/node-inspector/node-inspector) a tool for running Chrome developer tools server side
* [Git](http://www.git-scm.com) a tool for project version control
* [Meldmege](http://meldmerge.org) a diff tool for comparing changes in source code files
* [Firefox](https://www.mozilla.org/en-US/firefox/new/)
* [Chromium](http://www.chromium.org), the open source web browser that is packaged and distributed commercially as Google Chrome

## Developement Environment
These experiments have been developed on an Ubuntu Linux virtual machine running on a Mac OS X host laptop.
* [VirtualBox](https://www.virtualbox.org) for hosting the virtual machine I use for development
* [Ubuntu Linux](http://www.ubuntu.com)
* 2011 MacBook Pro

### Environment Variables
I add the environment variable `NODE_OPTIONS='--debug-brk'` when I'm using `node-inspector` a lot. Alternately, I launch my Meteor.js apps using the command `NODE_OPTIONS='--debug-brk' meteor` instead of just `meteor`.

### Ubuntu on Macbook Pro
I swapped the functions of the `control` and `command` keys so that, for example, I can use `command` + `c` as copy on both Mac OS and Ubuntu. Prior to this swap, switching back and forth between Mac OS and my Ubuntu virtual machine was driving me crazy. Here are the changes I made based on this [Stackoverflow tutorial](http://askubuntu.com/a/317898).

Launch gEdit create a file named .Xmodmap in the home directory:
    
    gedit ~/.Xmodmap

Paste the following into .Xmodmap

    clear control
    clear mod4
    
    keycode 105 =
    keycode 206 =
    
    keycode 133 = Control_L NoSymbol Control_L
    keycode 134 = Control_R NoSymbol Control_R
    keycode 37 = Super_L NoSymbol Super_L
    
    add control = Control_L
    add control = Control_R
    add mod4 = Super_L

Make .Xmodmap executable

    chmod +x .Xmodmap

Add the following to Ubuntu's Startup Applications, taking care to replace `YOURUSERNAME` with your actual user name

    /usr/bin/xmodmap /home/YOURUSERNAME/.Xmodmap

Restart Ubuntu and all of the Mac OS keyboard shortcuts you're used to using for copy, paste, save, undo, and redo will work consistently within your virtual machine.

## Development Process
Some notes on my workflow with Meteor.js applications.

### Application Directory Structure
When I start a Meteor Experiment, I like to reorganize the application directory structure to match that used by [Meteorpad](http://meteorpad.com) so that I can more easily share Meteor Experiments in an interactive format that others can modify on Meteorpad and so that I can more easily distinguish between client, server, and common application components.

`meteor create` generates an application directory with the following structure:

    MyNewApp/
      |- .meteor
      |- MyNewApp.css
      |- MyNewApp.html
      |- MyNewApp.js

As a relatively new Meteor.js user, I've found I'm less confused about what code is operating where with the following structure:

    MyNewApp/
      |- .meteor
      |- client/
         |- MyNewApp.css
         |- MyNewApp.html
         |- MyNewApp.js
      |- server/
         |- server.js
      |- common.js
      |- README.md

While this is a more verbose directory structure, as a new user it helps me to keep my code organized and avoid accidentally exposing code on the client that I want to keep private on the server. I add the `README.md` file for GitHub.com. Sometimes, I also add a `LICENSE.txt` file, like I have at the top level of this Meteor Experiments repository.

### Debugging
I've gotten in the habbit of using **node-inspector** and **robomongo** along with **Firefox** and **Chromium** developer tools to help debug my Meteor apps.

To use **node-inspector**, I first launch my app with debug mode turned on: `NODE_OPTIONS='--debug-brk' meteor`. Then, I open a new tab in my Terminal and run the `node-inspector` command. This gives me a localhost URL that I can visit to see Chrome developer tools running server-side. Either Safari or Chromium is required to use node-inspector, which implements the Webkit (Blink) developer tools. Note, when installing node-inspector make sure to use the `-g` flag as below:
    sudo npm install -g node-inspector

### Merging changes
I like Meldmerge. It allows a three-way file comparison where the merged file is positioned in between the two source files. I've found this format very convenient and helpful when trying to understand what is changing between file revisions. I'm still trying to figure out how to get Meldmerge working on Mac OS X, but it's [supposed to](http://superuser.com/a/422588). I'm not actually sure that Homebrew is necessary anymore since Meld can [run without being installed](http://meldmerge.org/). I just downloaded the *.tar.xz file and followed the [directions here](http://askubuntu.com/a/107976) to uncompress it.