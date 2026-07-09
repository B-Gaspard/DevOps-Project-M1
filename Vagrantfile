# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vbguest.auto_update = false if Vagrant.has_plugin?("vagrant-vbguest")

  # VM1: Jenkins Master
  config.vm.define "master" do |master|
    master.vm.box = "ubuntu/focal64"
    master.vm.hostname = "jenkins-master"
    master.vm.network "private_network", ip: "192.168.56.10"
    master.vm.network "forwarded_port", guest: 8080, host: 9090
    master.vm.provider "virtualbox" do |vb|
      vb.memory = "2048"
      vb.cpus = 2
    end
    master.vm.provision "shell", path: "provision-master.sh"
  end

  # VM2: Docker Host
  config.vm.define "dockerhost" do |dockerhost|
    dockerhost.vm.box = "ubuntu/focal64"
    dockerhost.vm.hostname = "docker-host"
    dockerhost.vm.network "private_network", ip: "192.168.56.11"
    dockerhost.vm.provider "virtualbox" do |vb|
      vb.memory = "2048"
      vb.cpus = 2
    end
    dockerhost.vm.provision "shell", path: "provision-dockerhost.sh"
  end

  # VM3: Production Server
  config.vm.define "production" do |production|
    production.vm.box = "ubuntu/focal64"
    production.vm.hostname = "production-server"
    production.vm.network "private_network", ip: "192.168.56.12"
    production.vm.network "forwarded_port", guest: 3000, host: 3000
    production.vm.provider "virtualbox" do |vb|
      vb.memory = "1024"
      vb.cpus = 1
    end
    production.vm.provision "shell", path: "provision-production.sh"
  end
end