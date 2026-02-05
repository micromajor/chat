#!/bin/bash
# Installation serveur
set -e
apt update && apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs git nginx certbot python3-certbot-nginx build-essential postgresql-client fail2ban
npm install -g pm2
adduser --disabled-password --gecos '' menhir || true
usermod -aG sudo menhir
mkdir -p /home/menhir/.ssh /home/menhir/logs /home/menhir/backups
cp ~/.ssh/authorized_keys /home/menhir/.ssh/ 2>/dev/null || true
chown -R menhir:menhir /home/menhir
chmod 700 /home/menhir/.ssh
chmod 600 /home/menhir/.ssh/authorized_keys 2>/dev/null || true
ufw allow 22/tcp && ufw allow 80/tcp && ufw allow 443/tcp && ufw --force enable
systemctl enable fail2ban && systemctl start fail2ban
echo 'Installation termin?e. Utilisez: su - menhir'
