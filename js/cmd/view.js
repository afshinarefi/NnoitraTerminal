import * as C from '../const.js';
import { Cmd } from './cmd.js'

export class View extends Cmd {
    static DESCRIPTION = 'View a photo or video.';

    static {
        this.register();
    }

    async process(args, div) {
        if (args[1].endsWith('.png') || args[1].endsWith('.jpg')) {
            let img = document.createElement('img');
            img.src = `/fs/${window.environment[C.PWD].join('/')}/${args[1]}`;
            img.classList.add('media');
            img.setAttribute('onload', 'window.scrollToAnchor();');
            div.appendChild(img);
        } else if (args[1].endsWith('.mp4')) {
            let video = document.createElement('video');
            video.src = `/fs/${window.environment[C.PWD].join('/')}/${args[1]}`;
            video.classList.add('media');
            video.controls = true;
            video.setAttribute('oncanplaythrough', 'window.scrollToAnchor();');
            div.appendChild(video);
        }
        return div;
    }

    args() {
        return '[FILE]';
    }
}

