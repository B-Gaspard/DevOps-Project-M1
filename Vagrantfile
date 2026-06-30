Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/focal64" 

  # -------------------------------------------------------------
  # NODE 1: Jenkins Master 
  # -------------------------------------------------------------
  config.vm.define "jenkins-master" do |node|
    node.vm.network "private_network", ip: "192.168.56.10"
    node.vm.network "forwarded_port", guest: 8080, host: 9090, host_ip: "127.0.0.1"
    node.vm.hostname = "jenkins-master"
    node.vm.provider "virtualbox" do |vb|
      vb.memory = "2048"
      vb.cpus = 2
    end
   
    node.vm.provision "shell", inline: <<-SHELL
      sudo apt-get update
      sudo apt-get install -y openjdk-17-jdk curl
      curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee /usr/share/keyrings/jenkins-keyring.asc > /dev/null
      echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/" | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null
      sudo apt-get update
      sudo apt-get install -y jenkins
      sudo systemctl start jenkins
      sudo systemctl enable jenkins
    SHELL
  end

  # -------------------------------------------------------------
  # NODE 2: Dynamic Docker Host 
  # -------------------------------------------------------------
  config.vm.define "docker-host" do |node|
    node.vm.network "private_network", ip: "192.168.56.11"
    node.vm.hostname = "docker-host"
    node.vm.provider "virtualbox" do |vb|
      vb.memory = "2048"
      vb.cpus = 1
    end
   
    node.vm.provision "shell", inline: <<-SHELL
      sudo apt-get update
      sudo apt-get install -y docker.io
      sudo sed -i 's|ExecStart=/usr/bin/dockerd -H fd://|ExecStart=/usr/bin/dockerd -H fd:// -H tcp://0.0.0.0:2375|' /lib/systemd/system/docker.service
      sudo systemctl daemon-reload
      sudo systemctl restart docker
      sudo systemctl enable docker
    SHELL
  end

  # -------------------------------------------------------------
  # NODE 3: Production Target Environment
  # -------------------------------------------------------------
  config.vm.define "prod-server" do |node|
    node.vm.network "private_network", ip: "192.168.56.12"
    node.vm.hostname = "prod-server"
    node.vm.provider "virtualbox" do |vb|
      vb.memory = "1024"
      vb.cpus = 1
    end
    
    node.vm.provision "shell", inline: <<-SHELL
      sudo apt-get update
      sudo apt-get install -y docker.io
      sudo systemctl start docker
      sudo systemctl enable docker
    SHELL
  end
end