# Vision Reader
#### The Comic book reader from the future

Vision , is a digital comic reading app , aimed at providing an smooth organization and reading experience for comic enthusiasts looking to enjoy their favourite issues and series digitally.

Vision is currently being built by one person and is focused on delivering on the key features that make enjoying a comic book digitally worth it

- Advanced Library : Allow the user manage a library of issues and collections , like folders on their PC , giving them greater control over their organization , like your physical comic bookshelf
<br>
<br>
[Library](./screenshots/library.png)
Library
<br>
<br>
[Collection](./screenshots/collection.png)
Collections

- Sleek and Modern Reader : A reader experience redesigned and focused on immersing the reader into their content by reducing clutter and only providing necessary information , opting for a trackbar instead of a thumbnail view and focusing on Keyboard Shortcut based navigation
<br>
<br>
[Reader](./screenshots/reader.png)
Reader

### Tech Stack
If you found your way to this github page , I assume you're interested in what Vision is built with.
Vision , is primarily an Electron app.I know what you're thinking , why an Electron app in the age of Tauri , the Rust powered 'Electron Killer' as the internet has named it.
Well primarily because I wanted to get Vision working as quickly as possible , because I also want to use it for my own comics.I also don't want to be battling Rust while also battling archiving and such and such.
Aside Electron, Vision is built with a lot of other things to , and has spawned it's own starter template [ElectroStatic](https://github.com/Inalegwu/ElectroStatic)

So what are the pieces in a nutshell ???

React: The primary UI Framework
<br>
Drizzle-ORM & Drizzle-Kit  : The ORM used for communicating with the storage layer
<br>
Better-SQLite3 : The SQLite Driver of choice
<br>
TRPC & Electron-TRPC : For communicating between the Renderer and Main process
<br>

This isn't an exhaustive list and other pieces of the template can be found in the project README , and if you find it interesting , consider giving it a star 😉

### What inspired Vision
Well, I wanted to read my comics again ,and in the country I'm from , comic books are outrageously expensive to get physically , so I settled on getting them digitally.
When time to actually read them came , I found the landscape of digital comics quite barren with only apps like CDDisplayEx and Cover scrapping by and not doing anything particularly innovative in my opinion , which is why I decided , Like all programmers do at some point , to build my own and make it better , which is why I tagged Vision <i>'the comic book reader from  the future'</i> because that's what I intend it to be


### Contributions
I'm still considering what Vision will turn out to be and as such , contributions are currently not open but you can watch the Repo , all news will be in the [discord server](https://discord.gg/dmKsRYHb)