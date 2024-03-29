import React from "react";

class Card extends React.Component {
  render() {
    return (<div className="scard col col-md-5">{this.props.children}</div>)
  }
}

class SelectableCard extends React.Component {

  render() {
    var isSelected = this.props.selected ? "selected" : "";
    var className = "selectable " + isSelected;
    return (
      <Card>
        <div className={className} onClick={this.props.onClick}>
          {this.props.children}
          <div className="check"><span className="checkmark">✔</span></div>
        </div>
      </Card>
    );
  }
}

class SelectableTitleCard extends React.Component {

  render() {
    var {
      title,
      description,
      selected,
      cardSize
    } = this.props;
    return (
      <SelectableCard onClick={this.props.onClick}
        selected={selected}>
        <div className="content">
          {cardSize === "small" && <h5 className="title">{title}</h5>}
          {cardSize == null && <h3 className="title">{title}</h3>}
          {description && <p className="description">{description}</p>}
        </div>
      </SelectableCard>
    );
  }
}

class SelectableCardList extends React.Component {

  constructor(props) {
    super(props);
    var selected;
    if(!props.multiple && props.selected)
    {
      selected = props.selected
    } else {
      selected = props.multiple ? [] : -1;
    }
    
    var initialState = {
      selected: selected
    };
    this.state = initialState;
  }

  onItemSelected(index) {
    this.setState((prevState, props) => {
      if (props.multiple) {
        var selectedIndexes = prevState.selected;
        var selectedIndex = selectedIndexes.indexOf(index);
        if (selectedIndex > -1) {
          selectedIndexes.splice(selectedIndex, 1);
          props.onChange(selectedIndexes);
        } else {
          if (!(selectedIndexes.length >= props.maxSelectable)) {
            selectedIndexes.push(index);
            props.onChange(selectedIndexes);
          }
        }
        return {
          selected: selectedIndexes
        };
      } else {
        props.onChange(index);
        return {
          selected: index
        }
      }
    });
  }

  render() {
    var {
      contents,
      multiple,
      cardSize
    } = this.props;

    var content = contents.map((cardContent, i) => {
      var {
        id,
        title,
        description,
        selected
      } = cardContent;
      var selected = multiple ? this.state.selected.indexOf(i) > -1 : this.state.selected === id;
      return (
        <SelectableTitleCard key={id} 
          title={title} description={description}
          selected={selected} 
          cardSize={cardSize}
          onClick={(e) => this.onItemSelected(id)} />
      );
    });
    const clsName = "cardlist_" + cardSize;
    return (
      <div className="row">{content}</div>

    );
  }
}

export default SelectableCardList