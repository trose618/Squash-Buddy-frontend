class Message{
    constructor(author, content, created_at){
        this.author = author
        this.content = content
        this.created_at = created_at
    }

    html(){
        return `<div class="content">
            <a class="author">${this.author}</a>
            <div class="metadata">
                <span class="date">${this.formatAMPM(new Date(this.created_at))}</span>
            </div>
            <div class="text">
                ${this.content}
            </div> 
        </div>`
    }

     formatAMPM(date) {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        let strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
      }
}