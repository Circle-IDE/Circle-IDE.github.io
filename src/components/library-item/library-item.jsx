import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';

import Box from '../box/box.jsx';
import PlayButton from '../../containers/play-button.jsx';
import styles from './library-item.css';
import classNames from 'classnames';

import bluetoothIconURL from './bluetooth.svg';
import internetConnectionIconURL from './internet-connection.svg';
import snailIconUrl from './snail.svg';

/* eslint-disable react/prefer-stateless-function */
class LibraryItemComponent extends React.PureComponent {
    render() {
        return this.props.featured ? (
            <div
                className={classNames(
                    styles.libraryItem,
                    styles.featuredItem,
                    {
                        [styles.disabled]: this.props.disabled
                    },
                    typeof this.props.extensionId === 'string' ? styles.libraryItemExtension : null,
                    this.props.hidden ? styles.hidden : null
                )}
                onClick={this.props.onClick}
            >
                <div className={styles.featuredImageContainer}>
                    {this.props.disabled ? (
                        <div className={styles.comingSoonText}>
                            <FormattedMessage
                                defaultMessage="Coming Soon"
                                description="Label for extensions that are not yet implemented"
                                id="gui.extensionLibrary.comingSoon"
                            />
                        </div>
                    ) : null}
                    <img
                        className={styles.featuredImage}
                        src={this.props.iconURL}
                    />
                </div>
                {(this.props.insetIconURL && !this.props.customInsetColor) ? (
                    <div className={
                        this.props.twDeveloper ?
                            classNames(styles.libraryItemInsetImageContainer, styles.twLibraryItemInsetImageContainer)
                            : styles.libraryItemInsetImageContainer
                    }
                    >
                        <img
                            className={styles.libraryItemInsetImage}
                            src={this.props.insetIconURL}
                        />
                    </div>
                ) : null}
                {(this.props.insetIconURL && this.props.customInsetColor) ? (
                    <div className={
                        styles.libraryItemInsetImageContainerNoBg
                    }
                        style={{ backgroundColor: this.props.customInsetColor }}
                    >
                        <img
                            className={styles.libraryItemInsetImage}
                            src={this.props.insetIconURL}
                        />
                    </div>
                ) : null}
                <div
                    className={typeof this.props.extensionId === 'string' ?
                        classNames(styles.featuredExtensionText, styles.featuredText) : styles.featuredText
                    }
                >
                    <span className={styles.libraryItemName}>{this.props.name}</span>
                    <br />
                    <span className={styles.featuredDescription}>{this.props.description}</span>
                    {this.props.docsURI && (
                        <span>
                            <br />
                            <a href={this.props.docsURI} target="_blank" rel="noopener noreferrer">
                                Click Here For Docs
                            </a>
                        </span>
                    )}
                </div>
                {
                    this.props.bluetoothRequired ||
                        this.props.internetConnectionRequired ||
                        this.props.collaborator ||
                        this.props.ruby ||
                        this.props.snailExt ||
                        this.props.extDeveloper ||
                        this.props.twDeveloper ||
                        this.props.eventSubmittor ||
                        this.props.credits
                        ? (
                            <div className={styles.featuredExtensionMetadata}>
                                <div className={styles.featuredExtensionRequirement}>
                                    {this.props.bluetoothRequired || this.props.internetConnectionRequired || this.props.snailExt ? (
                                        <div>
                                            <div>
                                                <FormattedMessage
                                                    defaultMessage="Requires"
                                                    description="Label for extension hardware requirements"
                                                    id="gui.extensionLibrary.requires"
                                                />
                                            </div>
                                            <div
                                                className={styles.featuredExtensionMetadataDetail}
                                            >
                                                {this.props.bluetoothRequired ? (
                                                    <img src={bluetoothIconURL} />
                                                ) : null}
                                                {this.props.internetConnectionRequired ? (
                                                    <img src={internetConnectionIconURL} />
                                                ) : null}
                                                {this.props.snailExt ? (
                                                    <img src={snailIconUrl} />
                                                ) : null}
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                                <div className={styles.featuredExtensionCollaboration}>
                                    {this.props.collaborator ? (
                                        <div>
                                            <div>
                                                <FormattedMessage
                                                    defaultMessage="Created by"
                                                    description="Label for extension collaboration"
                                                    id="gui.extensionLibrary.collaborationA"
                                                />
                                            </div>
                                            <div
                                                className={styles.featuredExtensionMetadataDetail}
                                            >
                                                {this.props.collaborator}
                                            </div>
                                        </div>
                                    ) : null}
                                    {this.props.ruby ? (
                                        <div>
                                            <div>
                                                <FormattedMessage
                                                    defaultMessage="Created By Ruby Dev(s)"
                                                    description="Label for ruby extensions"
                                                    id="gui.extensionLibrary.ruby"
                                                />
                                            </div>
                                            <div
                                                className={styles.featuredExtensionMetadataDetail}
                                            >
                                                {this.props.ruby}
                                            </div>
                                        </div>
                                    ) : null}
                                    {this.props.twDeveloper ? (
                                        <div>
                                            <div>
                                                Originally for TurboWarp by
                                            </div>
                                            <div
                                                className={styles.featuredExtensionMetadataDetail}
                                            >
                                                {this.props.twDeveloper}
                                            </div>
                                        </div>
                                    ) : null}
                                    {this.props.extDeveloper ? (
                                        <div>
                                            <div>
                                                Created by
                                            </div>
                                            <div
                                                className={styles.featuredExtensionMetadataDetail}
                                            >
                                                {this.props.extDeveloper}
                                            </div>
                                        </div>
                                    ) : null}
                                    {this.props.eventSubmittor ? (
                                        <div>
                                            <div>
                                                Event Submission by
                                            </div>
                                            <div
                                                className={styles.featuredExtensionMetadataDetail}
                                            >
                                                {this.props.eventSubmittor}
                                            </div>
                                        </div>
                                    ) : null}
                                    {this.props.credits ? (
                                        <div>
                                            <div>
                                                Credits
                                            </div>
                                            <div
                                                className={styles.featuredExtensionMetadataDetail}
                                            >
                                                {this.props.credits}
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        ) : null}
            </div>
        ) : (
            <Box
                className={classNames(
                    styles.libraryItem, {
                    [styles.hidden]: this.props.hidden
                }
                )}
                role="button"
                tabIndex="0"
                onBlur={this.props.onBlur}
                onClick={this.props.onClick}
                onFocus={this.props.onFocus}
                onKeyPress={this.props.onKeyPress}
                onMouseEnter={this.props.showPlayButton ? null : this.props.onMouseEnter}
                onMouseLeave={this.props.showPlayButton ? null : this.props.onMouseLeave}
            >
                <Box className={styles.libraryItemImageContainerWrapper}>
                    <Box
                        className={styles.libraryItemImageContainer}
                        onMouseEnter={this.props.showPlayButton ? this.props.onMouseEnter : null}
                        onMouseLeave={this.props.showPlayButton ? this.props.onMouseLeave : null}
                    >
                        <img
                            className={styles.libraryItemImage}
                            loading="lazy"
                            src={this.props.iconURL}
                        />
                    </Box>
                </Box>
                <span className={styles.libraryItemName}>{this.props.name}</span>
                {this.props.docsURI && (
                    <span>
                        <br />
                        <a href={this.props.docsURI} target="_blank" rel="noopener noreferrer">
                            Click Here For Docs
                        </a>
                    </span>
                )}
                {this.props.showPlayButton ? (
                    <PlayButton
                        isPlaying={this.props.isPlaying}
                        onPlay={this.props.onPlay}
                        onStop={this.props.onStop}
                    />
                ) : null}
            </Box>
        );
    }
}

LibraryItemComponent.propTypes = {
    bluetoothRequired: PropTypes.bool,
    snailExt: PropTypes.bool,
    collaborator: PropTypes.string,
    ruby: PropTypes.string,
    credits: PropTypes.string,
    twDeveloper: PropTypes.string,
    extDeveloper: PropTypes.string,
    eventSubmittor: PropTypes.string,
    description: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node
    ]),
    disabled: PropTypes.bool,
    extensionId: PropTypes.string,
    featured: PropTypes.bool,
    hidden: PropTypes.bool,
    iconURL: PropTypes.string,
    incompatibleWithScratch: PropTypes.bool,
    insetIconURL: PropTypes.string,
    customInsetColor: PropTypes.string,
    internetConnectionRequired: PropTypes.bool,
    isPlaying: PropTypes.bool,
    name: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node
    ]),
    onBlur: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    onKeyPress: PropTypes.func.isRequired,
    onMouseEnter: PropTypes.func.isRequired,
    onMouseLeave: PropTypes.func.isRequired,
    onPlay: PropTypes.func.isRequired,
    onStop: PropTypes.func.isRequired,
    docsURI: PropTypes.string,
    showPlayButton: PropTypes.bool
};

LibraryItemComponent.defaultProps = {
    disabled: false,
    showPlayButton: false
};

export default LibraryItemComponent;
