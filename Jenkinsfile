pipeline {
    agent any

    environment {
        BACKUP_FILE = "${env.WORKSPACE}/${sh(script: 'date +%Y-%m-%d', returnStdout: true).trim()}_strapi.tar.gz"
        GIT_SSH_CREDENTIALS_ID = 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQC/bFUJ5Xz7Hmf7eGs29cPCn3jxU+1AWQhQegTX6GmWuBgT33WpXGUAvonVT+Zq+yWzjAKkbKmVEGVD3Lhj4eSYbl7uZlkeSL7Oy8wX0VayDnEwsvQUIB1JhTSqh9fP7eKKsxUC4Vbz7asm5J1DNk1Gm+Zxl5uPGhWSidEMe1UljW2zhYOeEAQwpvl12WyycKbwwwIOzo9phBBhIetZnCBkS3dqKCfwAh3d8nl9wtuGkjUd6ssEgcARXia2586D+k+9+QTHDnSE4GZAgkv9IZjpbmFAtXkyEPTyc7mpOJLEKGRQfyR6V2sMg7BVdN49mewcApqg0ZHMYB2AxZvxZtwV9yGVGTlBhtcyIcvcjNF3n9PXUMyxQxElks2Q/YkA7kujNUXuwuCDA5XrnlToJ8+Sr4VyYfCmX03CiFBy6+RHUXcajcv3JhaS8HNVb8Z4SjDDhvH/JV1fXmDVxieZconCxG1R9Pm2bWfmXlgcNuj6dTV9hRp7spus6r/LbMBQzhp3NyEMJw2CtzLF0aBPdgAiOXzopVfp+FblHTWeySn14SyRTD4LmkSrC5zAExPVeYJnQNKgi3OfAW97XDe2GSGr3XAMLtiF3syDJLhMuZ963hO/YEQbYT697QaaplLtvyhCxuRRfIsC575WUF93UXtI0yjC7CNK0TJ3oOucYyqK3Q== shipitlive@gmail.com'
        GIT_SOURCE_REPO = 'git@github.com:shipitlive/shipitlive_strapy_backend.git'
        GIT_BACKUP_REPO = 'git@github.com:shipitlive/shipitlive-data-backup.git'
        
    }

    stages {
        stage('Clone Strapi Project') {
            steps {
                sshagent (credentials: [env.GIT_SSH_CREDENTIALS_ID]) {
                    sh 'git clone $GIT_SOURCE_REPO strapi-project'
                }
            }
        }

        stage('Take Backup of Strapi Data') {
            steps {
                dir('strapi-project') {
                    sh 'npm install'
                    sh 'npm run strapi export --file $BACKUP_FILE'
                }
            }
        }

        stage('Push Backup to Git') {
            steps {
                sshagent (credentials: [env.GIT_SSH_CREDENTIALS_ID]) {
                    sh '''
                    mkdir -p backup-repo
                    cd backup-repo
                    git clone $GIT_BACKUP_REPO .
                    mv $BACKUP_FILE .
                    git add .
                    git commit -m "Backup: $(date +%Y-%m-%d)"
                    git push origin main
                    '''
                }
            }
        }

        stage('Cleanup') {
            steps {
                sh 'rm -rf strapi-project backup-repo $BACKUP_FILE'
            }
        }
    }

    post {
        success {
            echo "🎉 Backup and push completed successfully!"
        }
        failure {
            echo "❌ Something went wrong! Check logs."
        }
    }
}
