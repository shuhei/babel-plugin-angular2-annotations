@Component({
  selector: 'hello'
})
@Template({
  inline: '<p>Hello, {{name}}!</p>'
})
export default class HelloComponent {
}
