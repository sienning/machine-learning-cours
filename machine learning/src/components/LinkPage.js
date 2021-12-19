import '../App.css';
import { Container, CardGroup, Card } from 'semantic-ui-react'

const LinkPage = () => {
    return (
        <Container>
            <br/>
            <CardGroup>
                <Card
                    href="/puissance-4"
                    header="Puissance 4"
                    meta="IA"
                    description="Vous êtes le joueur Rouge, essayez de vaincre l'IA (Jaune)"
                />
                <Card
                    href="/mediapipe"
                    header="MediaPipe"
                    meta="Machine Learning"
                    description="Testez différentes fonctionnalités sur caméra, proposées par Media Pipe"
                />
            </CardGroup>
            <br/>
        </Container>
    );
}

export default LinkPage;