import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    VrButton,
} from 'react-360';
import {
    BLACK,
    BLUE,
    CYAN,
    GREEN,
    MODE_DRAW,
    MODE_ERASE,
    MODE_MOVE,
    MODE_NOTE, MODE_NOTE_CREATE, MODE_NOTE_EDIT, MODE_SCENE,
    PINK,
    RED,
    WHITE,
    YELLOW
} from "../common/Color";
import {browserBridgeIndex} from "../module/BrowserBridgeIndex";
import {sceneManager} from "../service/SceneManager";

export default class HeadLockMenu360 extends React.Component {

    state = {
        open: true,
        color: RED,
        mode: MODE_DRAW,
        subtext: "Welcome to Aptero Virtual Meeting Room.\n" +
            "Share the url of this page to allow someone to connect. \n Please use Oculus Quest or Firefox with Oculus Rift for a full VR experience.",
    };

    setColor(event, color: string) {
        event.preventDefault();
        event.stopPropagation();
        this.setState({color: color})
        browserBridgeIndex.emit("colorChange", color);
    }

    setMode(event, mode: string) {
        event.preventDefault();
        event.stopPropagation();
        this.setState({mode: mode})
        browserBridgeIndex.emit("modeChange", mode);
    }


    render() {
        return (
            <React.Fragment>
                {
                    this.state.open &&
                    <View style={styles.panel}>

                        <View style={styles.greetingBox}>
                            <Text style={styles.greeting}>
                                {this.state.subtext}
                            </Text>
                        </View>

                        {this.state.mode === MODE_SCENE &&
                        <View style={styles.colorsBox}>
                            <VrButton style={styles.modeButton} onClick={(event) => {
                                sceneManager.eventEmitter.emit("change", {room: "A"});
                            }}>
                                <Text>A</Text>
                            </VrButton>
                            <VrButton style={styles.modeButton} onClick={(event) => {
                                sceneManager.eventEmitter.emit("change", {room: "B"});
                            }}><Text>B</Text>
                            </VrButton>
                            <VrButton style={styles.modeButton} onClick={(event) => {
                                sceneManager.eventEmitter.emit("change", {room: "C"});
                            }}><Text>C</Text></VrButton>
                        </View>
                        }

                        {this.state.mode === MODE_DRAW &&
                        <View style={styles.colorsBox}>
                            <VrButton style={this.state.color === RED ? styles.redSelected : styles.red}
                                      onButtonPress={() => {
                                          browserBridgeIndex.emit("vrButtonStart", {});
                                      }}
                                      onButtonRelease={() => {
                                          browserBridgeIndex.emit("vrButtonStop", {});
                                      }}
                                      onClick={(event) => {
                                          this.setColor(event, RED)
                                      }}>
                            </VrButton>
                            <VrButton style={this.state.color === GREEN ? styles.greenSelected : styles.green}
                                      onButtonPress={() => {
                                          browserBridgeIndex.emit("vrButtonStart", {});
                                      }}
                                      onButtonRelease={() => {
                                          browserBridgeIndex.emit("vrButtonStop", {});
                                      }}
                                      onClick={(event) => {
                                          this.setColor(event, GREEN)
                                      }}>
                            </VrButton>
                            <VrButton style={this.state.color === BLUE ? styles.blueSelected : styles.blue}
                                      onButtonPress={() => {
                                          browserBridgeIndex.emit("vrButtonStart", {});
                                      }}
                                      onButtonRelease={() => {
                                          browserBridgeIndex.emit("vrButtonStop", {});
                                      }}
                                      onClick={(event) => {
                                          this.setColor(event, BLUE)
                                      }}>
                            </VrButton>
                            <VrButton style={this.state.color === PINK ? styles.pinkSelected : styles.pink}
                                      onButtonPress={() => {
                                          browserBridgeIndex.emit("vrButtonStart", {});
                                      }}
                                      onButtonRelease={() => {
                                          browserBridgeIndex.emit("vrButtonStop", {});
                                      }}
                                      onClick={(event) => {
                                          this.setColor(event, PINK)
                                      }}>
                            </VrButton>
                            <VrButton style={this.state.color === YELLOW ? styles.yellowSelected : styles.yellow}

                                      onButtonPress={() => {
                                          browserBridgeIndex.emit("vrButtonStart", {});
                                      }}
                                      onButtonRelease={() => {
                                          browserBridgeIndex.emit("vrButtonStop", {});
                                      }}
                                      onClick={(event) => {
                                          this.setColor(event, YELLOW)
                                      }}>
                            </VrButton>
                            <VrButton style={this.state.color === CYAN ? styles.cyanSelected : styles.cyan}
                                      onButtonPress={() => {
                                          browserBridgeIndex.emit("vrButtonStart", {});
                                      }}
                                      onButtonRelease={() => {
                                          browserBridgeIndex.emit("vrButtonStop", {});
                                      }}
                                      onClick={(event) => {
                                          this.setColor(event, CYAN)
                                      }}>
                            </VrButton>
                            <VrButton style={this.state.color === BLACK ? styles.blackSelected : styles.black}
                                      onButtonPress={() => {
                                          browserBridgeIndex.emit("vrButtonStart", {});
                                      }}
                                      onButtonRelease={() => {
                                          browserBridgeIndex.emit("vrButtonStop", {});
                                      }}
                                      onClick={(event) => {
                                          this.setColor(event, BLACK)
                                      }}>
                            </VrButton>
                            <VrButton style={this.state.color === WHITE ? styles.whiteSelected : styles.white}
                                      onButtonPress={() => {
                                          browserBridgeIndex.emit("vrButtonStart", {});
                                      }}
                                      onButtonRelease={() => {
                                          browserBridgeIndex.emit("vrButtonStop", {});
                                      }}
                                      onClick={(event) => {
                                          this.setColor(event, WHITE)
                                      }}>
                            </VrButton>
                        </View>
                        }

                        <View style={styles.colorsModeBox}>
                            <View>
                                <VrButton
                                    style={this.state.mode === MODE_DRAW ? styles.modeButtonSelected : styles.modeButton}

                                    onButtonPress={() => {
                                        browserBridgeIndex.emit("vrButtonStart", {});
                                    }}
                                    onButtonRelease={() => {
                                        browserBridgeIndex.emit("vrButtonStop", {});
                                    }}
                                    onClick={(event) => {
                                        this.setState({subtext: "Use the trigger button to draw."});
                                        this.setMode(event, MODE_DRAW)
                                    }}><Text>Draw</Text></VrButton>
                                <VrButton
                                    style={this.state.mode === MODE_ERASE ? styles.modeButtonSelected : styles.modeButton}
                                    onButtonPress={() => {
                                        browserBridgeIndex.emit("vrButtonStart", {});
                                    }}
                                    onButtonRelease={() => {
                                        browserBridgeIndex.emit("vrButtonStop", {});
                                    }}
                                    onClick={(event) => {
                                        this.setState({subtext: "Use the trigger button to erase a drawing."});
                                        this.setMode(event, MODE_ERASE)
                                    }}><Text>Erase</Text></VrButton>
                            </View>
                            <View>
                                <VrButton
                                    style={this.state.mode === MODE_NOTE_CREATE ? styles.modeButtonSelected : styles.modeButton}
                                    onButtonPress={() => {
                                        browserBridgeIndex.emit("vrButtonStart", {});
                                    }}
                                    onButtonRelease={() => {
                                        browserBridgeIndex.emit("vrButtonStop", {});
                                    }}
                                    onClick={(event) => {
                                        this.setState({subtext: "Use the trigger button to add a note and move it. "});
                                        this.setMode(event, MODE_NOTE_CREATE)
                                    }}><Text>Create Note</Text></VrButton>
                                <VrButton
                                    style={this.state.mode === MODE_NOTE_EDIT ? styles.modeButtonSelected : styles.modeButton}
                                    onButtonPress={() => {
                                        browserBridgeIndex.emit("vrButtonStart", {});
                                    }}
                                    onButtonRelease={() => {
                                        browserBridgeIndex.emit("vrButtonStop", {});
                                    }}
                                    onClick={(event) => {
                                        this.setState({subtext: "Use the trigger button near a note to record your voice and add it to your note."});
                                        this.setMode(event, MODE_NOTE_EDIT)
                                    }}><Text>Edit Note</Text></VrButton>
                            </View>
                            <View>
                                <VrButton
                                    style={this.state.mode === MODE_MOVE ? styles.modeButtonSelected : styles.modeButton}
                                    onButtonPress={() => {
                                        browserBridgeIndex.emit("vrButtonStart", {});
                                    }}
                                    onButtonRelease={() => {
                                        browserBridgeIndex.emit("vrButtonStop", {});
                                    }}
                                    onClick={(event) => {
                                        this.setState({subtext: "Use the trigger button to move in direction of your head."});
                                        this.setMode(event, MODE_MOVE)
                                    }}><Text>Move</Text></VrButton>
                                <VrButton
                                    style={this.state.mode === MODE_SCENE ? styles.modeButtonSelected : styles.modeButton}
                                    onButtonPress={() => {
                                        browserBridgeIndex.emit("vrButtonStart", {});
                                    }}
                                    onButtonRelease={() => {
                                        browserBridgeIndex.emit("vrButtonStop", {});
                                    }}
                                    onClick={(event) => {
                                        this.setState({subtext: "Change the scene"});
                                        this.setMode(event, MODE_SCENE)
                                    }}><Text>Scene</Text></VrButton>
                            </View>
                        </View>
                    </View>
                }
            </React.Fragment>
        );
    }
};

const styles = StyleSheet.create({
    panel: {
        // Fill the entire surface
        width: 1000,
        height: 400,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    greetingBox: {
        margin: 20,
        padding: 20,
        backgroundColor: '#000000',
        borderColor: '#639dda',
        borderWidth: 2,
    },
    colorsModeBox: {
        flex: 1, flexDirection: 'row',
        marginTop: 0,
        marginBottom: 20,
        marginLeft: 20,
        marginRight: 20
    },
    colorsBox: {
        flex: 1, flexDirection: 'row',
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 20,
        marginRight: 20
    },
    modeButton: {
        marginLeft: 20,
        marginRight: 20,
        width: 150,
        height: 50,
        backgroundColor: '#000000',
        borderColor: '#639dda',
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modeButtonSelected: {
        marginLeft: 20,
        marginRight: 20,
        width: 150,
        height: 50,
        backgroundColor: '#000000',
        borderColor: '#dacc00',
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    red: {
        padding: 20,
        backgroundColor: '#FF0000',
        borderColor: '#639dda',
        borderWidth: 2,
        width: 50, height: 30
    },
    redSelected: {
        padding: 20,
        backgroundColor: '#FF0000',
        borderColor: '#dacc00',
        borderWidth: 2,
        width: 50, height: 30
    },
    green: {
        padding: 20,
        backgroundColor: '#00FF00',
        borderColor: '#639dda',
        borderWidth: 2,
        width: 50, height: 30
    },
    greenSelected: {
        padding: 20,
        backgroundColor: '#00FF00',
        borderColor: '#dacc00',
        borderWidth: 2,
        width: 50, height: 30
    },
    blue: {
        padding: 20,
        backgroundColor: '#0000FF',
        borderColor: '#639dda',
        borderWidth: 2,
        width: 50, height: 30
    },
    blueSelected: {
        padding: 20,
        backgroundColor: '#0000FF',
        borderColor: '#dacc00',
        borderWidth: 2,
        width: 50, height: 30
    },
    pink: {
        padding: 20,
        backgroundColor: '#ff00ff',
        borderColor: '#639dda',
        borderWidth: 2,
        width: 50, height: 30
    },
    pinkSelected: {
        padding: 20,
        backgroundColor: '#ff00ff',
        borderColor: '#dacc00',
        borderWidth: 2,
        width: 50, height: 30
    },
    cyan: {
        padding: 20,
        backgroundColor: '#00FFFF',
        borderColor: '#639dda',
        borderWidth: 2,
        width: 50, height: 30
    },
    cyanSelected: {
        padding: 20,
        backgroundColor: '#00FFFF',
        borderColor: '#dacc00',
        borderWidth: 2,
        width: 50, height: 30
    },
    yellow: {
        padding: 20,
        backgroundColor: '#FFFF00',
        borderColor: '#639dda',
        borderWidth: 2,
        width: 50, height: 30
    },
    yellowSelected: {
        padding: 20,
        backgroundColor: '#FFFF00',
        borderColor: '#dacc00',
        borderWidth: 2,
        width: 50, height: 30
    },
    white: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderColor: '#639dda',
        borderWidth: 2,
        width: 50, height: 30
    },
    whiteSelected: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderColor: '#dacc00',
        borderWidth: 2,
        width: 50, height: 30
    },
    black: {
        padding: 20,
        backgroundColor: '#000000',
        borderColor: '#639dda',
        borderWidth: 2,
        width: 50, height: 30
    },
    blackSelected: {
        padding: 20,
        backgroundColor: '#000000',
        borderColor: '#dacc00',
        borderWidth: 2,
        width: 50, height: 30
    },
    greeting: {
        fontSize: 30,
    },
});

