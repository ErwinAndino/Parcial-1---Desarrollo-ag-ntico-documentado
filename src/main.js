import Phaser from 'phaser';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#222222',

    scene: {
        create() {
            this.add.text(400, 300, 'PHASER FUNCIONANDO', {
                fontSize: '40px',
                color: '#ffffff'
            }).setOrigin(0.5);
        }
    }
};

new Phaser.Game(config);