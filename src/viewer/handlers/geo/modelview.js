import mix from '../../../common/mix';
import ModelView from '../../modelview';

/**
 * @constructor
 * @extends ModelView
 * @memberOf Geo
 * @param {GeometryModel} model
 */
function GeometryModelView(model) {
    ModelView.call(this, model);

    /** @member {?Texture} */
    this.texture = null;
}

mix(GeometryModelView.prototype, ModelView.prototype);

export default GeometryModelView;
