Sur le raspberry : 

#sudo apt-get update 
#sudo apt-get upgrade 

installe un compilateur récent : 
#sudo apt-get install g++-4.7 

Maintenant, tu as deux compilateurs sur le rpi, le 4.6 et le 4.7 
Utilise update-alternatives pour passer facilement de l'un à l'autre : 

#sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.6 
60 --slave /usr/bin/g++ g++ /usr/bin/g++-4.6 

#sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.7 
40 --slave /usr/bin/g++ g++ /usr/bin/g++-4.7 

#sudo update-alternatives --config gcc 

(choisi la version 4.7) 
Verifie que tout est ok en faisant g++ --version 

ensuite : 
installe la libusb : 

#sudo apt-get install libusb-1.0.0-dev 

ensuite : 

#npm install elastic-beam 