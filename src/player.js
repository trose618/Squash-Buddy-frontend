class Player{

    constructor(id, name, level, city, zipcode, imageurl, created_at){
        this.id = id
        this.name = name
        this.level = level
        this.city = city
        this.zipcode = zipcode
        this.created_at = created_at
        if(imageurl === null){
            this.imageurl = `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAH4AfgMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAABQYCAwQBB//EADYQAAICAQEDCQcCBwEAAAAAAAABAgMEEQUGIRIiMVFhcZGxwRMyM0FygeE1UhUlQlNiodEU/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/APuIAAAAAAAAAAA81PQAAAAAAAAAAAAAAc2dnUYNXtLpfTFdMjPLyIYuPO6z3YLXvKPmZVuZkyuufF9C14RXUB35m38u9tUv2FfVH3vEjp32zes7rJP/ACm2agBvqy8ml61ZFse6bJfA3isg1DNjy4/vitGvsQJ6B9BptrurjZVJShJapozKbsTaUsHI5Fkn7Cx85P8ApfWXJcQAAAAAAAAAAAr29mQ0qMeL4PWcvJepWyZ3o1/iUdej2S08WQwAAAAAALpsHIeRsypyesocxt9n4KWWndPX/wAVuvR7Xh4ICcAAAAAAAAAAFb3soanRkLoacH5r1K8XzaGLHNxZ0S4armvqfyKPfTPHtlVbHkzi9GgNYAAAAAXLd2h07MrbXGxub+/R/oreycCWfkqK19lHjY+zqLtGKjFKK0S4JAegAAAAAAAAAAcG1NmU58NZcy1e7Yl59h3mMpxitZNJdbYFJzdl5eI3y6nKH74LVfg4i9WbSwq+E8qlPq5aZy2bR2RJ8+dMu116+gFQScmlFat/JcWSmBsPKyWpXJ0Vdcvefcv+k7VtTZUPh3VQ7oaeh11Z2Lb8PJpk+pTQHuJi04dKqojyYrxfazeFxAAAAAAAAAA5M7aGPgw5V89G+iK4tmrbG0Y4GPqtHbLhCPqU662y+2Vl0nOculsCUzN4cq5tUJUw7OMvEi7LrLpcq6yU31ylqawAAAHo7zwAb6MzJxnrRfOHYnw8CZwt45xajm18qP8Achwf3RXwB9Ax76sitWUzU4PoaNpRdn59uBerKnrF+/D5SRdMXIryqIXVPWMlqgNwAAAAClbcyXk7StevNg+RHuX51I8zuet1jfS5vzMAAAAAAAAAAAAFg3UyWrLcWT4NcuPk/QgCU3bf82r7Yy8gLgAAAAA+e2/Fn9T8zAzt+LP6n5mAAAAAAAAAAAACU3b/AFav6ZeRFkpu3+rV/TLyAuIAA//Z`
        }else{
            this.imageurl = imageurl
        }
    }

    html(){
        return `<div class="ui special cards">
        <div class="card">
          <div class="blurring dimmable image">
            <div class="ui dimmer">
              <div class="content">
                <div class="center" id=${this.id}>
                  <div class="ui inverted button" dataset-id=${this.id} id="${this.name}">Message</div>
                </div>
              </div>
            </div>
            <img src="${this.imageurl}" type="img">
          </div>
          <div class="content">
            <a class="header" dataset-id=${this.id}>${this.name}</a>
            <div class="meta">
              <span>Level: ${this.level}</span><br>
              <span>City: ${this.city}</span><br>
            </div>
          </div>
          <div class="extra content">
            Member since ${this.formatedDateMonth()}
          </div>
        </div>
      </div>`
    }

    formatedDateMonth(){
      let date = new Date(this.created_at)
      
      return `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`
    }
}

//CREATE CARDS WITH SEMANTIC UI!! :-DDD
