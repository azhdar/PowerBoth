On the raspberry : 

#sudo apt-get update 
#sudo apt-get upgrade 

install a recent compileur: 
#sudo apt-get install g++-4.7 

Now we have two compileur on the rpi, le 4.6 et le 4.7 
Use update-alternative to switch between them:

#sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.6 
60 --slave /usr/bin/g++ g++ /usr/bin/g++-4.6 

#sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.7 
40 --slave /usr/bin/g++ g++ /usr/bin/g++-4.7 

#sudo update-alternatives --config gcc 

(choose version 4.7) 
Check everything is ok with: g++ --version 

next : 
install libusb : 

#sudo apt-get install libusb-1.0.0-dev 

then : 

#npm install elastic-beam 