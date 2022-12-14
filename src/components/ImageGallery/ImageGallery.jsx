import { getApi } from '../../utils/Api';
import { Component } from 'react';
import { toast } from 'react-toastify';
import { ImageGalleryItem } from '../ImageGalleryItem/ImageGalleryItem';
import { Loader } from 'components/Loader/Loader';
import { Button } from '../Button/Button';
import { List } from './ImageGallery.styled';

export class ImageGallery extends Component {
  state = {
    page: 1,
    listImage: null,
    visibleBtnLoading: false,
    isLoader: false,
  };
  getPage = () => {
    this.setState(({ page }) => ({ page: page + 1 }));
  };

  async componentDidUpdate(prevProps, prevState) {
    const prevStatePage = prevState.page;
    const nextStatePage = this.state.page;
    const prevName = prevProps.nextName;
    const nextName = this.props.nextName;
    const { listImage } = this.state;

    if (prevName !== nextName) {
      this.setState({ page: 1, listImage: [] });
    }

    if (prevName !== nextName || prevStatePage !== nextStatePage) {
      try {
        this.setState({ isLoader: true });
        const res = await getApi(nextStatePage, nextName);
        this.setState({ isLoader: false });
        if (res.hits.length / 12 === 1) {
          this.setState({ visibleBtnLoading: true });
          toast.success('✅ Запит пройшов успішно');
        } else if (res.hits.length === 0) {
          this.setState({ visibleBtnLoading: false });
          toast.warn(
            '🤔 На жаль по даному запиту нічого не знайдено. Спробуйте змінити запит!📝'
          );
        } else {
          this.setState({ visibleBtnLoading: false });
          toast.info('Це максимальна кількість фото по данній темі!!!✅');
        }

        if (!listImage) {
          return this.setState({ listImage: res.hits });
        }

        this.setState(prevState => {
          return { listImage: [...prevState.listImage, ...res.hits] };
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  render() {
    const { listImage, visibleBtnLoading, isLoader } = this.state;
    return (
      <>
        <List>
          {listImage &&
            listImage.map(item => (
              <ImageGalleryItem key={item.id} item={item} />
            ))}
        </List>
        <Loader visible={isLoader} />
        {visibleBtnLoading && !isLoader && <Button onClick={this.getPage} />}
      </>
    );
  }
}
