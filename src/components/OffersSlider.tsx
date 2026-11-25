import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { brandColors, borderRadius, spacing } from '../theme';
import { OFFERS_DATA, OfferItem } from '../data/offers.data';

// Named layout & timing constants
const SCREEN_WIDTH = Dimensions.get('window').width;
const HORIZONTAL_PADDING = spacing.px_4 * 2; // Left & right screen padding
const CARD_WIDTH = SCREEN_WIDTH - HORIZONTAL_PADDING;
const AUTO_SCROLL_INTERVAL_MS = 3500;

const DOT_INACTIVE_SIZE = 6;
const DOT_ACTIVE_WIDTH = 18;
const DOT_HEIGHT = 6;
const DOT_SPACING = spacing.px_1 + 1; // 5px

interface OffersSliderProps {
  offers?: OfferItem[];
  onPressOffer?: (offer: OfferItem) => void;
}

export default function OffersSlider({
  offers = OFFERS_DATA,
  onPressOffer,
}: OffersSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const flatListRef = useRef<FlatList<OfferItem>>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const offerCount = offers?.length ?? 0;

  // Auto-scroll effect: advances to next slide and loops back to first
  useEffect(() => {
    if (offerCount <= 1 || isUserInteracting) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % offerCount;
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        return nextIndex;
      });
    }, AUTO_SCROLL_INTERVAL_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [offerCount, isUserInteracting]);

  // Update active dot index from scroll offset
  const handleMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / CARD_WIDTH);
      if (index >= 0 && index < offerCount) {
        setActiveIndex(index);
      }
      setIsUserInteracting(false);
    },
    [offerCount]
  );

  const handleScrollBeginDrag = useCallback(() => {
    setIsUserInteracting(true);
  }, []);

  const handleScrollEndDrag = useCallback(() => {
    // Resume auto-scroll after a short delay
    setTimeout(() => {
      setIsUserInteracting(false);
    }, 1000);
  }, []);

  // Hide entire section if offers data array is empty
  if (!offers || offers.length === 0) {
    return null;
  }

  const renderOfferItem = ({ item }: { item: OfferItem }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => onPressOffer?.(item)}
    >
      <View style={styles.cardContentRow}>
        {/* Left Text Block */}
        <View style={styles.textContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.tag}</Text>
          </View>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>

        {/* Right Thumbnail Image */}
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={styles.cardImage}
            resizeMode="cover"
          />
        ) : null}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.sliderContainer}>
      {/* Horizontal FlatList Carousel */}
      <FlatList
        ref={flatListRef}
        data={offers}
        keyExtractor={(item) => item.id}
        renderItem={renderOfferItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH}
        decelerationRate="fast"
        onScrollBeginDrag={handleScrollBeginDrag}
        onScrollEndDrag={handleScrollEndDrag}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        getItemLayout={(_, index) => ({
          length: CARD_WIDTH,
          offset: CARD_WIDTH * index,
          index,
        })}
      />

      {/* Dots Indicator */}
      {offers.length > 1 && (
        <View style={styles.dotsContainer}>
          {offers.map((_, index) => {
            const isActive = index === activeIndex;
            return (
              <View
                key={`dot_${index}`}
                style={[
                  styles.dot,
                  isActive ? styles.activeDot : styles.inactiveDot,
                ]}
              />
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sliderContainer: {
    marginBottom: spacing.px_3,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: brandColors.aoloCardBg,
    borderRadius: borderRadius.lg + 4, // 20px
    padding: spacing.px_4,
    borderWidth: 1,
    borderColor: brandColors.aoloBorderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  cardContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    paddingRight: spacing.px_3,
  },
  badge: {
    backgroundColor: brandColors.aoloGreen,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.px_3,
    paddingVertical: spacing.px_1,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: brandColors.aoloBlack,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: brandColors.aoloText,
    marginTop: spacing.px_2,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Roboto',
    color: brandColors.aoloGray,
    marginTop: spacing.px_1 - 1,
  },
  cardImage: {
    width: 68,
    height: 68,
    borderRadius: borderRadius.md,
    backgroundColor: brandColors.aoloBg,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.px_2,
    gap: DOT_SPACING,
  },
  dot: {
    height: DOT_HEIGHT,
    borderRadius: borderRadius.full,
  },
  activeDot: {
    width: DOT_ACTIVE_WIDTH,
    backgroundColor: brandColors.aoloBlack,
  },
  inactiveDot: {
    width: DOT_INACTIVE_SIZE,
    backgroundColor: brandColors.aoloBorderLight,
  },
});
