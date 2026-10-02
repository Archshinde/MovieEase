import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox'
import {PaletteTree} from './palette'
import App from "../App.jsx";
import SearchBar from "../components/SearchBar.jsx";

const ComponentPreviews = () => {
	return (
		<Previews palette={<PaletteTree/>}>
			<ComponentPreview path="/App">
				<App/>
			</ComponentPreview>
			<ComponentPreview path="/SearchBar">
				<SearchBar/>
			</ComponentPreview>
		</Previews>
	)
}

export default ComponentPreviews